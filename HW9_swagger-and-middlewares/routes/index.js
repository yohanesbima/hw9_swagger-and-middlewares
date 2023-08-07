const express = require("express");
const router = express.Router();
const logger = require('./logger');
const authRouter = require("./auth.js")
const usersRouter = require("./users.js")
const moviesRouter = require("./movies.js")
const { authentication } = require("../middlewares/auth.js");

router.use(logger);
router.use("/auth", authRouter);

router.use(authentication)
// KENA AUTHENTICATION
router.use("/movies", moviesRouter);
router.use("/users", usersRouter);


module.exports = router;