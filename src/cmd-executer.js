/**
 * @file 执行命令
 * @author Sheeta(wuhayao@gmail.com)
 */

import path from 'path';
import fs from 'fs';
import qs from 'querystring';
import prompt from 'promt';
import chalk from 'chalk';
import jshashes from 'jshashes';
import request from 'request';

const configFilePath = path.join(process.env.LOCALAPPDATA || process.env.HOME, '.bundle-rocket.config');
const SHA256 = new jshashes.SHA256();
const BUNDLE_ROCKET_URL = 'http://localhost:8080';
const URL_REGISTER = BUNDLE_ROCKET_URL + '/register';
const URL_LOGIN = BUNDLE_ROCKET_URL + '/login';
const URL_APP = BUNDLE_ROCKET_URL + '/app';

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
 * 执行cmd-parser解析出来的命令
 *
 * @param  {Object} cmd 命令对象
 */
export function execute(cmd) {
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
                console.log(`${chalk.yellow('[ERROR]')} ${chalk.cyan(configFilePath)} is blank or not exists. Please register or login first.`);
            });
    }
};

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
            console.log(chalk.yellow('[APP ADD] ' + error.status) + ' ' + error.info);
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
    getAppId(token, appName).then(function (appId) {
        var url = URL_APP + '/' + appId + '/bundles';
        var data = {
            pageNum: 1,
            pageSize: 5
        };
        sendRequest('get', url, data, token)
            .then(function (bundles) {
                // { count: 0, rows: [] }
                bundles.count === 0
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
    }, function (error) {
        console.log(chalk.yellow('[GET APP] ' + error.status) + ' ' + error.info);
    });
}

function bundleAdd(token, appName, bundleVersion, bundleDir) {
    getAppId(token, appName).then(function (appId) {
        var bundleStat = fs.statSync(bundleDir);
        if (bundleStat.isFile()) {
            upload(token, appId, '0.0.1', bundleVersion, bundleDir, bundleStat.size);
        }
        else if (bundleStat.isDirectory()) {
            // TODO 处理文件夹批量上传的情况
        }
    }, function (error) {
        console.log(chalk.yellow('[GET APP] ' + error.status) + ' ' + error.info);
    });
}

function upload(token, appId, appVersion, bundleVersion, bundleDir, bundleSize) {
    var url = URL_APP + '/' + appId + '/bundles';
    var formData = {
        appVersion: appVersion,
        bundleVersion: bundleVersion,
        bundleSize: bundleSize,
        bundle: fs.createReadStream(bundleDir)
    };
    request.post({
        url: url,
        headers: {
            authorization: 'Bearer ' + token
        },
        formData: formData
    }, function (err, response, body) {
        if (err) {
            return console.error('Upload failed, please try again');
        }
        if (response.statusCode === 200) {
            console.log(body);
        }
        else {
            console.log(chalk.yellow('[UPLOAD] ' + response.statusCode) + ' ' + body);
        }
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

    return new Promise((resolve, reject) => {
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
        request(options, (err, res, body) => {
            if (err) {
                throw new Error(err);
            }
            switch (res.statusCode) {
                case 200:
                    resolve(JSON.parse(body));
                    break;
                case 204:
                    // 204表示不带实体的返回
                    resolve();
                    break;
                case 401:
                    // 401表示授权失败，需要重新登录
                    console.log(''
                        + 'Your session is out of date, use '
                        + chalk.cyan('bundle-rocket login')
                        + ' to log in again.');
                    return;
                default:
                    var result = {
                        status: res.statusCode,
                        info: body
                    };
                    reject(result);
            }
        });
    });
}
