const winston = require("winston");

const fileLogger = winston.createLogger({
    level: "info",
    transports: [
        new winston.transports.File({ filename: 'error.log', level: 'error' }),
        new winston.transports.File({ filename: 'success.log' }),
    ]
});

module.exports = {
    fileLogger
}