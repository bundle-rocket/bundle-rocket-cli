/**
 * @file 执行命令
 * @author Sheeta(wuhayao@gmail.com)
 */

/* eslint-disable no-console */

var path = require('path');
var Q = require('q');
var prompt = require('prompt');
var chalk = require('chalk');
var jshashes = require('jshashes');
var request = require('request');
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
 * @return {Function} 命令方法分发
 */
function execute(cmd) {
    switch (cmd.type) {
        case 'register':
            return register(cmd);
        case 'login':
            return login(cmd);
    }
    getSession().then(function (token) {
        switch (cmd.type) {
            case 'logout':
                return logout();
            case 'appList':
                return appList(token);
            case 'appAdd':
                return appAdd(token, cmd.appName);
        }
    }, function (err) {
        console.log(''
            + chalk.yellow('[ERROR] ')
            + chalk.cyan(configFilePath)
            + ' is blank or not exists.'
            + ' Please register or login first.'
        );
    });
    return;
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
 * 登出账户
 * 由于服务器目前并不存储登录状态，这里仅仅是删除本地 token。
 */
function logout() {
    rmSession();
}

/**
 * 添加 APP
 *
 * @param {string} token token
 * @param {string} appName 应用名称
 */
function appAdd(token, appName) {
    var appAddUrl = BUNDLE_ROCKET_URL + '/app';
    var postData = {
        name: appName
    };
    sendHTTPPost(appAddUrl, postData, token)
        .then(function (value) {
            console.log('Successfully added ' + chalk.cyan(appName));
            console.log(value);
        }, function (error) {
            console.log(chalk.yellow('[APP ADD] ' + error.status) + ' ' + error.info);
        });
}

function appList(token) {
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
    var registerUrl = BUNDLE_ROCKET_URL + '/register';
    var postData = {
        email: data.email.trim(),
        name: data.name.trim(),
        password: SHA256.hex(data.password.trim())
    };
    sendHTTPPost(registerUrl, postData)
        .then(function (value) {
            requestAccessToken(data);
        }, function (error) {
            console.log(chalk.yellow('[REGISTER] ' + error.status) + ' ' + error.info);
        });
}

/**
 * 请求 token
 *
 * @param {Object} data 用户的原始注册信息
 */
function requestAccessToken(data) {
    var loginUrl = BUNDLE_ROCKET_URL + '/login';
    var postData = {
        email: data.email.trim(),
        password: SHA256.hex(data.password.trim())
    };
    sendHTTPPost(loginUrl, postData)
        .then(function (value) {
            saveSession(data, value);
        }, function (error) {
            console.log(chalk.yellow('[LOGIN] ' + error.status) + ' ' + error.info);
        });
}

/**
 * 发送 POST 请求
 *
 * @param {Object} url 请求地址
 * @param {Object} data 要发送的内容
 * @return {Object} Promise
 */
function sendHTTPPost(url, data, token) {
    return Q.Promise(function (resolve, reject, notify) {
        var headers = {
            'content-type': 'application/json',
            'accept-type': 'application/json'
        };
        if (token) {
            headers.authorization = 'Bearer ' + token;
        }
        var options = {
            url: url,
            method: 'POST',
            headers: headers,
            body: JSON.stringify(data)
        };
        request(options, function (err, res, body) {
            if (err) {
                console.log(chalk.yellow(err));
                return;
            }
            else if (res.statusCode !== 200) {
                var result = {
                    status: res.statusCode,
                    info: body
                };
                reject(result);
            }
            else {
                resolve(body);
            }
        });
    });
}

/**
 * 保存 session 信息到.bundle-rocket.config 文件中
 *
 * @param {Object} data 用户登录时输入的信息对象
 * @param {Object} token 包含 access token 的对象
 */
function saveSession(data, token) {
    try {
        fs.writeFileSync(configFilePath, token, {encoding: 'utf-8'});
        console.log(''
            + 'Successfully logged in as ' + chalk.cyan(data.email)
            + '. You can check out account info in ' + chalk.cyan(configFilePath)
            + '.'
        );
    }
    catch (error) {
        throw error;
    }
}

/**
 * 获取本地 session 信息
 *
 * @return {Object} Promise
 */
function getSession() {
    try {
        return Q.Promise(function (resolve, reject, notify) {
            var session = fs.readFileSync(configFilePath, {encoding: 'utf-8'});
            if (session === '') {
                reject(null);
            }
            else {
                resolve(JSON.parse(session).token);
            }
        });
    }
    catch (error) {
        throw error;
    }
}

/**
 * 删除本地 session 信息
 */
function rmSession() {
    try {
        fs.writeFileSync(configFilePath, '', {encoding: 'utf-8'});
        console.log('Successfully logged out.');
    }
    catch (error) {
        throw error;
    }
}

exports.execute = execute;
