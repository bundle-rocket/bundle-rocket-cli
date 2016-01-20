/**
 * @file user dao
 * @author leon(ludafa@outlook.com)
 */

const {save, clear} = require('../session.js');
const {SHA256} = require('jshashes');
const sha256 = new SHA256();

/**
 * 创建用户
 *
 * @param {string} serverURL 服务器地址
 * @param {string} name 用户名
 * @param {string} email 邮箱
 * @param {string} password 密码
 * @return {Promise}
 */
exports.add = function (serverURL, name, email, password) {

    return fetch(`${serverURL}/users`, {
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
 * @param {string} serverURL 服务器地址
 * @param {string} email 邮箱
 * @param {string} password 密码
 * @return {Promise}
 */
exports.login = function (serverURL, email, password) {

    return fetch(`${serverURL}/access-token`, {
        method: 'POST',
        headers: {
            'content-type': 'application/json',
            'accept-type': 'application/json'
        },
        body: JSON.stringify({
            email,
            password: sha256.hex(password)
        })
    }).then(function (response) {

        if (response.ok) {
            return response.json();
        }

        throw {status: response.status};

    }).then(function (data) {

        const {token} = data;

        return save({
            email,
            [serverURL]: token
        });

    });

};

/**
 * 登出
 *
 * @param {string} serverURL 服务器地址
 * @return {Promise}
 */
exports.logout = function (serverURL) {
    return clear(serverURL);
};
