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
var qs = require('querystring');
var Table = require('cli-table');

var configFilePath = path.join(process.env.LOCALAPPDATA || process.env.HOME, '.bundle-rocket.config');
var SHA256 = new jshashes.SHA256();
const BUNDLE_ROCKET_URL = 'http://localhost:8080';
const URL_REGISTER = BUNDLE_ROCKET_URL + '/register';
const URL_LOGIN = BUNDLE_ROCKET_URL + '/login';
const URL_APP = BUNDLE_ROCKET_URL + '/app';

// prompt 相关配置
prompt.message = '';
prompt.delimiter = '';

var email = {
    description: chalk.cyan('Enter your email address:'),
    required: true,
    type: 'string',
    pattern: /^\s*[\w_.]+@[\w_.]+?\s*$/,
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
        default:
            getSession().then(function (token) {
                switch (cmd.type) {
                    case 'logout':
                        logout();
                        break;
                    case 'appList':
                        appList(token);
                        break;
                    case 'appAdd':
                        appAdd(token, cmd.appName);
                        break;
                    case 'appDetail':
                        appDetail(token, cmd.appName);
                        break;
                    case 'appRemove':
                        appRemove(token, cmd.appName);
                        break;
                    case 'bundleList':
                        bundleList(token, cmd.appName);
                        break;
                    case 'bundleAdd':
                        bundleAdd(token, cmd.appName, cmd.bundleVersion, cmd.bundleDir);
                        break;
                }
            }, function (err) {
                console.log(''
                    + chalk.yellow('[ERROR] ')
                    + chalk.cyan(configFilePath)
                    + ' is blank or not exists.'
                    + ' Please register or login first.'
                );
            });
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
 * 登出账户
 * 由于服务器目前并不存储登录状态，这里仅仅是删除本地 token。
 */
function logout() {
    rmSession();
}

/**
 * 添加 APP
 * 所有关于 APP 的操作可以通过 appName 来识别
 * 要求 appName 唯一
 *
 * @param {string} token token
 * @param {string} appName 应用名称
 */
function appAdd(token, appName) {
    var postData = {
        name: appName
    };
    sendRequest('post', URL_APP, postData, token)
        .then(function (value) {
            console.log('Successfully added ' + chalk.cyan(appName));
            console.log(value);
        }, function (error) {
            error.status === 401
                ? console.log(''
                    + 'Your session is out of date, use '
                    + chalk.cyan('bundle-rocket login')
                    + ' to log in again.')
                : console.log(chalk.yellow('[APP ADD] ' + error.status) + ' ' + error.info);
        });
}

function appList(token) {
    var data = {
        pageNum: 1,
        pageSize: 5
    };
    sendRequest('get', URL_APP, data, token)
        .then(function (apps) {
            apps.length === 0
                ? console.log('You have not created an App. Use '
                    + chalk.cyan('bundle-rocket app add <app-name>')
                    + ' to create an app.')
                : printTable(
                    ['ID', 'Name', 'Secret Key', 'Created At'],
                    function (dataSource) {
                        apps.forEach(function (item) {
                            dataSource.push([
                                item.id,
                                item.name,
                                item.secretKey,
                                item.created_at
                            ]);
                        });
                    }
                );
        }, function (error) {
            console.log(chalk.yellow('[APP LIST] ' + error.status) + ' ' + error.info);
        });
}

function appDetail(token, appName) {
    getApp(token, appName).then(function (detail) {
        console.log(detail);
    }, function (error) {
        console.log(chalk.yellow('[APP DETAIL] ' + error.status) + ' ' + error.info);
    });
}

function appRemove(token, appName) {
    var url = URL_APP + '/' + appName;
    sendRequest('delete', url, token)
        .then(function () {
            console.log('Successfully removed ' + chalk.cyan(appName));
        }, function (error) {
            console.log(chalk.yellow('[APP REMOVE] ' + error.status) + ' ' + error.info);
        });
}

function bundleList(token, appName) {
    getApp(token, appName).then(function (app) {
        var url = URL_APP + '/' + app.id + '/bundles';
        var data = {
            pageNum: 1,
            pageSize: 5
        };
        sendRequest('get', url, data, token)
            .then(function (bundles) {
                bundles.length === 0
                    ? console.log('You have not uploaded any bundle. Use '
                        + chalk.cyan('bundle-rocket bundle add <app-name> <bundle-version> <bundle-directory>')
                        + ' to upload a bundle.')
                    : printTable(
                        ['Bundle ID', 'Version', 'APP Version', 'Location'],
                        function (dataSource) {
                            bundles.forEach(function (item) {
                                dataSource.push([
                                    item.id,
                                    item.version,
                                    item.appVersion,
                                    item.location
                                ]);
                            });
                        }
                    );
            }, function (error) {
                console.log(chalk.yellow('[BUNDLE LIST] ' + error.status) + ' ' + error.info);
            });
    });
}

function bundleAdd() {}

function getApp(token, appName) {
    return Q.Promise(function (resolve, reject, notify) {
        var url = URL_APP + '/' + appName;
        sendRequest('get', url, token)
            .then(function (detail) {
                resolve(detail);
            }, function (error) {
                reject(error);
            });
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
    sendRequest('post', URL_REGISTER, postData)
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
    var postData = {
        email: data.email.trim(),
        password: SHA256.hex(data.password.trim())
    };
    sendRequest('post', URL_LOGIN, postData)
        .then(function (value) {
            saveSession(data, value);
        }, function (error) {
            console.log(chalk.yellow('[LOGIN] ' + error.status) + ' ' + error.info);
        });
}

/**
 * 发送 POST 请求
 *
 * @param {string} method HTTP 请求方法
 * @param {Object} url 请求地址
 * @param {Object} data 要发送的内容
 * @param {string} token access token
 * @return {Object} Promise
 */
function sendRequest(method, url, data, token) {
    if (typeof data === 'string') {
        token = data;
        data = null;
    }
    return Q.Promise(function (resolve, reject, notify) {
        var headers = {
            'content-type': 'application/json',
            'accept-type': 'application/json'
        };
        if (token) {
            headers.authorization = 'Bearer ' + token;
        }
        var options = {
            method: method,
            headers: headers
        };
        if (data) {
            switch (method.toLowerCase()) {
                case 'get':
                    options.url = url + '?' + qs.stringify(data);
                    break;
                case 'post':
                    options.url = url;
                    options.body = JSON.stringify(data);
                    break;
                default:
                    options.url = url;
            }
        }
        else {
            options.url = url;
        }
        request(options, function (err, res, body) {
            if (err) {
                console.log(chalk.yellow(err));
                return;
            }
            else if (res.statusCode === 204) {
                resolve();
            }
            else if (res.statusCode !== 200) {
                var result = {
                    status: res.statusCode,
                    info: body
                };
                reject(result);
            }
            else {
                resolve(JSON.parse(body));
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
        fs.writeFileSync(configFilePath, JSON.stringify(token), {encoding: 'utf-8'});
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

/**
 * 将一组信息以表格形式输出
 *
 * @param {Array.<string>} columns 表头信息
 * @param {Function} readData 将信息以行为单位插入表格中
 */
function printTable(columns, readData) {
    var table = new Table({
        head: columns,
        style: {head: ['cyan']}
    });
    readData(table);
    console.log(table.toString());
}

exports.execute = execute;
