/**
 * @file user dao
 * @author leon(ludafa@outlook.com)
 */

const {serverURL} = require('../conf.js');
const {save, clear} = require('../session.js');
const {SHA256} = require('jshashes');
const sha256 = new SHA256();

/**
 * 创建用户
 *
 * @param {string} name 用户名
 * @param {string} email 邮箱
 * @param {string} password 密码
 * @return {Promise}
 */
exports.add = function (name, email, password) {

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
    });

};

/**
 * 登录
 *
 * @param {string} email 邮箱
 * @param {string} password 密码
 * @return {Promise}
 */
exports.login = function (email, password) {

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
        return response.json();
    }).then(function (token) {
        return save({email, password}, token);
    });

};

exports.logout = function () {
    return clear();
};
