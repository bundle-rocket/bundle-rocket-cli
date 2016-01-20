/**
 * @file app executor
 * @author Sheeta(wuhayao@gmail.com)
 * @author leon(ludafa@outlook.com)
 */

var chalk = require('chalk');

var _require = require('../util.js');

var printTable = _require.printTable;

var _require2 = require('../dao/app');

var add = _require2.add;
var get = _require2.get;
var list = _require2.list;
var remove = _require2.remove;

/**
 * 添加 APP
 * 所有关于 APP 的操作可以通过 appName 来识别
 * 要求 appName 唯一
 *
 * @param {Object} command 命令参数
 * @param {string} command.appName 应用名称
 * @return {Promise}
 */
function appAdd(_ref) {
    var appName = _ref.appName;

    return add.apply(undefined, arguments).then(function (app) {
        console.log('Successfully added ' + chalk.cyan(appName));
    })['catch'](function (error) {
        console.error(chalk.yellow('[APP ADD] ' + error.status) + ' ' + error.info);
    });
}

/**
 * 列举应用
 *
 */
function appList() {

    list.apply(undefined, arguments).then(function (apps) {

        if (!apps.length) {
            console.log('You have not created an App. Use ' + chalk.cyan('bundle-rocket app add <app-name>') + ' to create an app.');
            return;
        }

        printTable(['ID', 'Name', 'Secret Key', 'Created At'], function (dataSource) {
            apps.forEach(function (item) {
                dataSource.push([item.id, item.name, item.secretKey, item.created_at]);
            });
        });
    })['catch'](function (error) {
        console.log(chalk.yellow('[APP LIST] ' + error.status) + ' ' + error.info);
    });
}

/**
 * 显示应用详情
 *
 * @param {Object} command 命令参数
 * @param {string} command.appName 应用名称
 * @return {Promise}
 */
function appDetail(_ref2) {
    var appName = _ref2.appName;

    return get.apply(undefined, arguments).then(function (app) {
        console.log(app);
    })['catch'](function (error) {
        console.log(chalk.yellow('[APP DETAIL] ' + error.status) + ' ' + error.info);
    });
}

/**
 * 移除应用
 *
 * @param {Object} command 命令参数
 * @param {string} command.appName 应用名称
 * @return {Promise}
 */
function appRemove(_ref3) {
    var appName = _ref3.appName;

    return remove.apply(undefined, arguments).then(function () {
        console.log('Successfully removed ' + chalk.cyan(appName));
    }, function (error) {
        console.log(chalk.yellow('[APP REMOVE] ' + error.status) + ' ' + error.info);
    });
}

module.exports = {
    appAdd: appAdd,
    appList: appList,
    appDetail: appDetail,
    appRemove: appRemove
};