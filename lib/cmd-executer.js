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
    }
}

/**
 * 注册
 *
 * @param {Object} cmd 命令对象
 */
function register(cmd) {
    createAccount().then(function (data) {
        requestAccessToken(cmd, data);
    });
}

/**
 * 创建账户
 *
 * @return {Object} Promise 对象
 */
function createAccount() {
    return Q.Promise(function (resolve, reject, notify) {
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
            description: chalk.cyan('Enter your name(optional):'),
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
 * 获取 access token
 *
 * @param {Object} cmd 命令对象
 * @param {Object} data 用户的原始注册信息
 */
function requestAccessToken(cmd, data) {
    var postData = {
        email: data.email.trim(),
        name: data.name.trim(),
        password: SHA256.hex(data.password.trim())
    };
    var options = {
        url: cmd.serverUrl,
        method: 'POST',
        headers: {
            'content-type': 'application/x-www-form-urlencoded',
            'accept-type': 'application/json'
        },
        body: qs.stringify(postData)
    };
    request(options, function (err, res, body) {
        if (err) {
            console.log(err);
            return;
        }
        if (res.statusCode !== 200) {
            console.log(chalk.yellow(body));
            return;
        }
        saveSessionInfo(body);
    });
}

/**
 * 保存 session 信息到.bundle-rocket.config 文件中
 *
 * @param {Object} data 包含 access token 的对象
 */
function saveSessionInfo(data) {
    fs.writeFileSync(configFilePath, data, {encoding: 'utf-8'});
    console.log('\r\nSuccessfully logged in. Your session was written in ' + chalk.cyan(configFilePath));
}

exports.execute = execute;
