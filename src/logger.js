/**
 * @file bundle rocket cli logger
 * @author leon(ludafa@outlook.com)
 */

const {Logger, transports: {Console}} = require('winston');

const logger = new Logger({

    transports: [
        new Console({
            level: process.env.NODE_MODE === 'production' ? 'error' : 'verbose',
            colorize: true
        })
    ]

});

module.exports = logger;
