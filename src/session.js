/**
 * @file session
 * @author Sheeta(wuhayao@gmail.com)
 * @author leon(ludafa@outlook.com)
 */

const fs = require('fs');
const path = require('path');
const chalk = require('chalk');

const configFilePath = path.join(
    process.env.LOCALAPPDATA || process.env.HOME,
    '.bundle-rocket.config'
);

/**
 * 保存 session 信息到.bundle-rocket.config 文件中
 *
 * @param {Object} data 用户登录时输入的信息对象
 * @param {Object} token 包含 access token 的对象
 * @return {Promise}
 */
exports.save = function (data, token) {

    return exports.get().then(function (currentSession) {

        return new Promise(function (resolve, reject) {

            fs.writeFile(
                configFilePath,
                {...currentSession, ...data, token},
                {encoding: 'utf-8'},
                function (err) {

                    if (err) {
                        reject(err);
                        return;
                    }

                    console.log(''
                        + 'Successfully logged in as ' + chalk.cyan(data.email)
                        + '. You can check out account info in ' + chalk.cyan(configFilePath)
                        + '.'
                    );

                    resolve();
                }
            );

        });

    });

};

/**
 * 删除本地 session 信息
 *
 * @return {Promise}
 */
exports.clear = function () {

    return new Promise(function (resolve, reject) {

        fs.writeFile(configFilePath, '{}', 'utf-8', function (err) {

            if (err) {
                reject();
                return;
            }

            resolve();
            console.log('bye');
        });

    });

};

/**
 * 获取本地 session 信息
 *
 * @return {Object}
 */
exports.get = function () {

    return new Promise(function (resolve, reject) {

        fs.stat(configFilePath, function (err, stat) {

            if (err) {
                resolve({});
                return;
            }

            fs.readFile(configFilePath, 'utf8', function (err, data) {

                try {
                    resolve(JSON.parse(data));
                }
                catch (err) {
                    reject(err);
                }

            });

        });

    });

};

/**
 * 获取 session token
 *
 * @return {Promise}
 */
exports.getToken = function () {
    return exports
        .get()
        .then(function (session) {

            if (session && session.token) {
                return session.token;
            }

            throw new Error('no valid session');

        });
};
