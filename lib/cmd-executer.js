/**
 * @file 执行命令
 * @author Sheeta(wuhayao@gmail.com)
 */

var path = require('path');
var Q = require('q');
var prompt = require('prompt');
var chalk = require('chalk');
var jshashes = require('jshashes');
var request = require('request');
var qs = require('querystring');
var fs = require('fs');

var configFilePath = path.join(process.env.LOCALAPPDATA || process.env.HOME, '.bundle-rocket.config');
var SHA256 = new jshashes.SHA256();
var BUNDLE_ROCKET_URL = 'http://localhost:8080';

// prompt 相关配置
prompt.message = '';
prompt.delimiter = '';

var email = {
    description: chalk.cyan('Enter your email address:'),
    required: true,
    type: 'string',
    pattern: /^\s*[\w_.]+@[\w_.]+ ?\s*$/,
    message: 'Please enter a valid email address.'
};
var name = {
    description: chalk.cyan('Enter your name:'),
    required: false,
    type: 'string',
    pattern: /^\s*[\w_]+\s*$/,
    message: 'Please enter a valid name which only include letters, digits or underscores.'
};
var password = {
    description: chalk.cyan('Enter your password:'),
    required: true,
    hidden: true,
    type: 'string',
    pattern: /^\s*[\w_]+\s*$/,
    message: 'Please enter a valid password which only include letters, digits or underscores.'
};

/**
 * 执行cmd-parser解析出来的命令
 *
 * @param  {Object} cmd 命令对象
 */
function execute(cmd) {
    switch (cmd.type) {
        case 'register':
            register(cmd);
            break;
        case 'login':
            login(cmd);
            break;
    }
}

/**
 * 注册账户，如果注册成功则触发自动登录
 *
 * @param {Object} cmd 命令对象
 */
function register(cmd) {
    createAccount().then(function (data) {
        saveAccount(data);
    });
}

/**
 * 登录账户
 *
 * @param {Object} cmd 命令对象
 */
function login(cmd) {
    inputAccount().then(function (data) {
        requestAccessToken(data);
    });
}

/**
 * 创建账户
 *
 * @return {Object} Promise 对象
 */
function createAccount() {
    return Q.Promise(function (resolve, reject, notify) {
        prompt.start();
        prompt.get({
            properties: {
                email: email,
                name: name,
                password: password
            }
        }, function (err, result) {
            if (err) {
                resolve(null);
            }
            if (result) {
                resolve(result);
            }
        });
    });
}

/**
 * 输入账户信息
 *
 * @return {Object} Promise 对象
 */
function inputAccount() {
    return Q.Promise(function (resolve, reject, notify) {
        prompt.start();
        prompt.get({
            properties: {
                email: email,
                password: password
            }
        }, function (err, result) {
            if (err) {
                resolve(null);
            }
            if (result) {
                resolve(result);
            }
        });
    });
}

/**
 * 创建账户，然后请求 token 登录
 *
 * @param {Object} data 用户的原始注册信息
 */
function saveAccount(data) {
    var postData = {
        email: data.email.trim(),
        name: data.name.trim(),
        password: SHA256.hex(data.password.trim())
    };
    var options = {
        url: BUNDLE_ROCKET_URL + '/register',
        method: 'POST',
        headers: {
            'content-type': 'application/x-www-form-urlencoded',
            'accept-type': 'application/json'
        },
        body: qs.stringify(postData)
    };
    request(options, function (err, res, body) {
        if (err) {
            console.log(chalk.yellow('[REGISTER] ') + err);
            return;
        }
        if (res.statusCode !== 200) {
            console.log(chalk.yellow('[REGISTER] ' + res.statusCode) + ' ' + body);
            return;
        }
        requestAccessToken(data);
    });
}

/**
 * 请求 token
 *
 * @param {Object} data 用户的原始注册信息
 */
function requestAccessToken(data) {
    var postData = {
        email: data.email.trim(),
        password: SHA256.hex(data.password.trim())
    };
    var options = {
        url: BUNDLE_ROCKET_URL + '/login',
        method: 'POST',
        headers: {
            'content-type': 'application/x-www-form-urlencoded',
            'accept-type': 'application/json'
        },
        body: qs.stringify(postData)
    };
    request(options, function (err, res, body) {
        if (err) {
            console.log(chalk.yellow('[LOGIN] ') + err);
            return;
        }
        if (res.statusCode !== 200) {
            console.log(chalk.yellow('[LOGIN] ' + res.statusCode) + ' ' + body);
            return;
        }
        saveSessionInfo(data, body);
    });
}

/**
 * 保存 session 信息到.bundle-rocket.config 文件中
 *
 * @param {Object} data 用户登录时输入的信息对象
 * @param {Object} token 包含 access token 的对象
 */
function saveSessionInfo(data, token) {
    data.token = token.token;
    fs.writeFileSync(configFilePath, data, {encoding: 'utf-8'});
    console.log('\r\nSuccessfully logged in as ' + chalk.cyan(data.email) + '. You can check out account info in ' + chalk.cyan(configFilePath) + '\r\n');
}

exports.execute = execute;
