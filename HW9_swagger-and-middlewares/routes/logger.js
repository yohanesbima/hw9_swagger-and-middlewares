const fs = require('fs');
const morgan = require('morgan');

// Create a write stream for the log file
const accessLogStream = fs.createWriteStream('./logs/access.log', { flags: 'a' });

// Create a custom logger using morgan
const logger = morgan('combined', { stream: accessLogStream });

module.exports = logger;
