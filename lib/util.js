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

    var table = new Table({
        head: columns,
        style: {head: ['cyan']}
    });

    readData(table);
    console.log(table.toString());

};
