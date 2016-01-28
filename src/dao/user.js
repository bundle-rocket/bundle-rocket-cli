/**
 * @file user dao
 * @author leon(ludafa@outlook.com)
 */

const {addAccessToken, removeAccessToken} = require('../dao/session.js');
const {SHA256} = require('jshashes');
const sha256 = new SHA256();

const logger = require('../logger.js');

/**
 * 创建用户
 *
 * @param {string} name 用户名
 * @param {string} email 邮箱
 * @param {string} password 密码
 * @param {?Object} options 公用参数
 * @param {string} options.serverURL 服务器地址
 * @return {Promise}
 */
exports.add = function (name, email, password, options) {

    const {registry} = options;

    return fetch(`${registry}/users`, {
        method: 'POST',
        headers: {
            'content-type': 'application/json',
            'accept-type': 'application/json'
        },
        body: JSON.stringify({
            name,
            email,
            password: sha256.hex(password)
        })
    }).then(function (response) {

        if (response.ok) {
            return response.json();
        }

        const {status} = response;

        throw {status};

    });

};

/**
 * 登录
 *
 * @param {string} email 邮箱
 * @param {string} password 密码
 * @param {Object} options 参数
 * @param {string} options.registry 服务器地址
 * @return {Promise}
 */
exports.login = function (email, password, options) {

    logger.verbose('fetching access token: email %s', email);

    const {registry} = options;

    return fetch(`${registry}/access-token`, {
        method: 'POST',
        headers: {
            'content-type': 'application/json',
            'accept-type': 'application/json'
        },
        body: JSON.stringify({
            email,
            password: sha256.hex(password)
        })
    }).then(require('./middleware/json.js')).then(function (data) {
        const {token} = data;
        logger.verbose('[access-token] [POST] access token succeed: access token %s', token);
        return addAccessToken(email, registry, token);
    });

};

/**
 * 登出
 *
 * @param {Object} options 命令参数
 * @param {string} options.serverURL 服务器地址
 * @return {Promise}
 */
exports.logout = function (options) {
    return removeAccessToken(options);
};
