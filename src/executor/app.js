/**
 * @file app executor
 * @author Sheeta(wuhayao@gmail.com)
 * @author leon(ludafa@outlook.com)
 */

const chalk = require('chalk');
const {printTable} = require('../util.js');

const {add, get, list, remove, createConf} = require('../dao/app');

/**
 * 添加 APP
 * 所有关于 APP 的操作可以通过 appName 来识别
 * 要求 appName 唯一
 *
 * @param {Object} command 命令参数
 * @param {string} command.appName 应用名称
 * @return {Promise}
 */
function appAdd({appName}) {

    return add(...arguments)
        .then(function (app) {
            console.log('Successfully added ' + chalk.cyan(appName));
        })
        .catch(function (error) {
            console.error(chalk.yellow('[APP ADD] ' + error.status) + ' ' + error.info);
        });

}

/**
 * 列举应用
 *
 */
function appList() {

    list(...arguments).then(function (apps) {

        if (!apps.length) {
            console.log(
                'You have not created an App. Use '
                + chalk.cyan('bundle-rocket app add <app-name>')
                + ' to create an app.'
            );
            return;
        }

        printTable(
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

    }).catch(function (error) {
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
function appDetail({appName}) {

    return get(...arguments).then(function (app) {
        console.log(app);
    }).catch(function (error) {
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
function appRemove({appName}) {

    return remove(...arguments).then(function () {
        console.log('Successfully removed ' + chalk.cyan(appName));
    }, function (error) {
        console.log(chalk.yellow('[APP REMOVE] ' + error.status) + ' ' + error.info);
    });

}

const path = require('path');
const prompt = require('prompt');

function init(command) {

    let pkg = {};

    try {
        pkg = require(path.join(process.cwd(), 'package.json'));
    }
    catch (error) {}

    prompt.start();

    const schema = {
        properties: {
            name: {
                'default': pkg.name,
                'message': 'please input a name',
                'required': true
            }
        }
    };

    prompt.get(schema, function (error, result) {

        if (error) {
            return;
        }

        createConf(result)
            .then(function () {
                console.log('bundle-rocket.json created');
            })
            .catch(function (error) {
                console.error(error.message);
            });

    });

}

module.exports = {
    init,
    appAdd,
    appList,
    appDetail,
    appRemove
};
