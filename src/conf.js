/**
 * @file conf
 * @author leon(ludafa@outlook.com)
 */

const path = require('path');
const fs = require('fs');
const cwd = process.cwd();

const CONF_FILE_NAME = 'bundle-rocket.json';

function findConfFilePath(start) {

    start = start || cwd;

    return new Promise(function (resolve, reject) {

        if (process.platform === 'Win32' && /^\w:\\$/.test(start)
            || start === '/'
        ) {
            reject({
                status: 404,
                message: 'cannot find bundle-rocket.json'
            });
            return;
        }

        const configFilePath = path.join(start, CONF_FILE_NAME);

        fs.stat(configFilePath, function (err, stat) {

            if (err && err.code === 'ENOENT') {
                return resolve(findConfFilePath(path.join(start, '..')));
            }

            if (!stat.isFile()) {

            }

            resolve(configFilePath);

        });

    });

}

function getConf() {

    return findConfFilePath().then(function (confFilePath) {

        return new Promise(function (resolve, reject) {

            fs.readFile(confFilePath, 'utf8', function (err, data) {

                let conf;

                try {
                    conf = JSON.parse(data);
                }
                catch (error) {
                    reject(error);
                    return;
                }

                resolve(conf);

            });

        });

    });

}

function saveConf(conf) {

    return findConfFilePath().then(function (confFilePath) {

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

    });

}

module.exports = {
    getConf,
    saveConf,
    findConfFilePath
};
