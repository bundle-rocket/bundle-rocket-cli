
/**
 * @file register executor
 * @author leon(ludafa@outlook.com)
 */

const chalk = require('chalk');
const prompt = require('prompt');
const {add, login, logout} = require('../dao/user.js');

// prompt 相关配置
prompt.message = '';
prompt.delimiter = '';

const email = {
    description: chalk.cyan('Enter your email address:'),
    required: true,
    type: 'string',
    pattern: /^\s*[\w_.]+@[\w_.]+?\s*$/,
    message: 'Please enter a valid email address.'
};

const name = {
    description: chalk.cyan('Enter your name:'),
    required: false,
    type: 'string',
    pattern: /^\s*[\w_]+\s*$/,
    message: 'Please enter a valid name which only include letters, digits or underscores.'
};

const password = {
    description: chalk.cyan('Enter your password:'),
    required: true,
    hidden: true,
    type: 'string',
    pattern: /^\s*[\w_]+\s*$/,
    message: 'Please enter a valid password which only include letters, digits or underscores.'
};

/**
 * 从 CLI 获取用户信息
 *
 * @return {Object} Promise 对象
 */
function getUserInfoFromCLI() {
    return new Promise(function (resolve, reject) {
        prompt.start();
        prompt.get({
            properties: {
                email: email,
                name: name,
                password: password
            }
        }, function (err, result) {
            if (err) {
                reject(err);
                return;
            }
            resolve(result);
        });
    });
}

/**
 * 从 CLI 获取用户登录信息
 *
 * @return {Object} Promise 对象
 */
function getLoginInfoFromCLI() {

    return new Promise(function (resolve, reject) {
        prompt.start();
        prompt.get({
            properties: {
                email: email,
                password: password
            }
        }, function (err, result) {
            if (err) {
                reject(err);
                return;
            }
            resolve(result);
        });
    });

}

/**
 * 注册账户，如果注册成功则触发自动登录
 */
exports.register = function () {

    getUserInfoFromCLI()
        .then(function ({email, name, password}) {
            return add(name, email, password)
                .then(function () {
                    console.log('[REGISTER] succeed');
                    return login(email, password);
                });
        })
        .then(function () {
            console.log('[LOGIN] succeed');
        })
        .catch(function (error) {
            console.error(error.message);
        });

};


/**
 * 登录账户
 */
exports.login = function () {
    getLoginInfoFromCLI()
        .then(function ({email, password}) {
            return login(email, password);
        })
        .then(function () {
            console.log('[LOGIN] succeed!');
        })
        .catch(function (error) {
            console.error(error.message);
        });
};

/**
 * 登出账户
 * 由于服务器目前并不存储登录状态，这里仅仅是删除本地 token。
 */
exports.logout = function () {
    logout()
        .then(function () {
            console.log('bye');
        })
        .catch(function (error) {
            console.error(error.message);
        });
};
