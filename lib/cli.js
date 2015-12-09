/**
 * @file 主函数
 * @author Sheeta(wuhayao@gmail.com)
 */

var chalk = require('chalk');

var parser = require('./cmd-parser');
var executer = require('./cmd-executer');

function init() {
    var cmd = parser.parse();
    if (!cmd) {
        console.log(chalk.red('[ERROR]') + ' Please use correct command');
        return;
    }
    executer.execute(cmd);
}

exports.init = init;
