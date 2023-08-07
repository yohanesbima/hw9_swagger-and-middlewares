
const express = require("express");
const router = express.Router();
const pool = require("../config/config.js");
const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 10;
const { authorization } = require("../middlewares/auth.js")


router.get("/", async (req, res, next) => {
    try {
        let { page, limit } = req.query;

        const findQuery = `
            SELECT
                *
            FROM movies
            LIMIT $1 OFFSET $2
        `;

        const countQuery = `
            SELECT
                COUNT(*)
            FROM movies
        `;

        page = +page || DEFAULT_PAGE;
        limit = +limit || DEFAULT_LIMIT;
        let offset = (page - 1) * limit;

        const result = await pool.query(findQuery, [limit, offset]);
        let totalData = await pool.query(countQuery);
        totalData = +totalData.rows[0].count;

        let totalPages = Math.ceil(totalData / limit);
        let next = page < totalPages ? page + 1 : null;
        let previous = page > 1 ? page - 1 : null;

        res.status(200).json({
            data: result.rows,
            totalPages,
            totalData,
            currentPage: page,
            next,
            previous,
        });
    } catch (err) {
        next(err);
    }
});



router.get("/:id", async (req, res, next) => {
    try {
        const { id } = req.params;

        const findQuery = `
        select * from movies where id = $1
        `;

        const result = await pool.query(findQuery, [id]);

        if (result.rows.length === 0) {
            throw { name: "ErrorNotFound" };
        } else {
            res.status(200).json(result.rows[0]);
        }
    } catch (err) {
        next(err);
    }
});



router.post('/', authorization, async (req, res) => {
    try {
        const { title, genres, year } = req.body
        await pool.query('insert into movies (title, genres, year) values ($1, $2, $3)', [title, genres, year])
        res.status(200).json({ message: 'Added Successfully' })
    } catch (err) {
        console.error(err)
    }
})

router.put('/:id', authorization, async (req, res) => {
    try {
        const { id } = req.params
        const { title, genres, year } = req.body
        await pool.query('update movies set title = $1, genres = $2, year = $3 where id = $4', [title, genres, year, id])
        res.status(200).json({ message: 'Updated Successfully' })
    } catch {
        console.error(err)
    }
})

router.delete('/:id', authorization, async (req, res) => {
    try {
        const { id } = req.params
        await pool.query('delete from movies where id = $1', [id])
        res.status(200).json({ message: 'Deleted Successfully' })
    } catch (err) {
        console.error(err)
    }
})

module.exports = router