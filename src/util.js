/**
 * @file utility tools
 * @author leon(ludafa@outlook.com)
 */

const Table = require('cli-table');

/**
 * 将一组信息以表格形式输出
 *
 * @param {Array.<string>} columns 表头信息
 * @param {Function} readData 将信息以行为单位插入表格中
 */
exports.printTable = function printTable(columns, readData) {

    const table = new Table({
        head: columns,
        style: {head: ['cyan']}
    });

    readData(table);
    console.log(table.toString());

};

exports.addCommonOptions = function (yargs) {

    console.log('heheda', yargs);

    yargs.option('global', {
        'alias': 'g',
        'describe': 'use the user configuration',
        'default': false
    });

};

const path = require('path');
const fs = require('fs');

exports.findAncestor = function findProjectRoot(fileName, start) {

    start = start || process.cwd();

    return new Promise(function (resolve, reject) {

        if (process.platform === 'Win32' && /^\w:\\$/.test(start)
            || start === '/'
        ) {
            reject({
                status: 404,
                message: `cannot find ${fileName}`
            });
            return;
        }

        const confFilePath = path.join(start, fileName);

        fs.stat(confFilePath, function (err, stat) {

            if (err && err.code === 'ENOENT' || !stat.isFile()) {
                return resolve(findProjectRoot(fileName, path.join(start, '..')));
            }

            resolve(confFilePath);

        });

    });

};

/**
 * 获取一个 JSON 数据
 *
 * @param {string} path 路径
 * @return {Promise}
 */
exports.readJSON = function (path) {

    return new Promise(function (resolve, reject) {

        fs.readFile(path, 'utf8', function (error, data) {

            if (error) {
                reject(error);
                return;
            }

            try {
                resolve(JSON.parse(data));
            }
            catch (error) {
                reject(error);
            }

        });

    });

};

/**
 * 保存文件
 *
 * @param {string} path 路径
 * @param {Object} content 数据
 * @return {Promise}
 */
exports.writeJSON = function (path, content) {

    return new Promise(function (resolve, reject) {

        fs.writeFile(path, JSON.stringify(content, null, 4), 'utf8', function (error) {

            if (error) {
                reject(error);
                return;
            }

            resolve();

        });

    });

};
