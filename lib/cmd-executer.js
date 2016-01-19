/**
 * @file 执行命令
 * @author Sheeta(wuhayao@gmail.com)
 */

/* eslint-disable no-console */

var path = require('path');
var Q = require('q');
var prompt = require('prompt');
var chalk = require('chalk');

var request = require('request');
var fs = require('fs');
var qs = require('querystring');

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

exports.execute = execute;
