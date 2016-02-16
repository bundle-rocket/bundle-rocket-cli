/**
 * @file app dao
 * @author leon(ludafa@outlook.com)
 */

const {resolveAccessToken} = require('../dao/session.js');
const json = require('./middleware/json.js');
const logger = require('../logger.js');

exports.get = function (nameOrId, options) {

    const {registry, servers} = options;
    const accessToken = resolveAccessToken(registry, servers);

    logger.verbose(`[app dao] [view]`, accessToken, nameOrId);

    return fetch(`${registry}/apps/${nameOrId}`, {
        method: 'GET',
        headers: {
            'content-type': 'application/json',
            'accept-type': 'application/json',
            'authorization': `Bearer ${accessToken}`
        }
    }).then(json).then(function (app) {
        logger.verbose(`[app dao] [GET]`, app);
        return app;
    });


};


const fs = require('fs');
const path = require('path');
const CONF_FILE_NAME = 'bundle-rocket.json';

exports.createConf = function (conf) {

    const confFilePath = path.join(process.cwd(), CONF_FILE_NAME);

    return new Promise(function (resolve, reject) {

        fs.writeFile(
            confFilePath,
            JSON.stringify(conf, null, 4),
            'utf8',
            function (err) {

                if (err) {
                    reject(err);
                    return;
                }

                resolve();

            }
        );

    });

};
