/**
 * @file server command executor
 * @author leon(ludafa@outlook.com)
 */

const {findConfig} = require('../conf.js');

exports.serverList = function (command) {

    const config = findConfig();

    console.log(config);

};
