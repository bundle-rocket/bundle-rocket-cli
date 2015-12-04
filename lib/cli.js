/**
 * @file 主函数
 * @author Sheeta(wuhayao@gmail.com)
 */

var parser = require('./command-parser');
var executer = require('./command-executer');

function init() {
    var cmd = parser.parse();
    console.log(cmd);
    if (!cmd) {
        console.log('show usage');
        return;
    }
    executer.execute(cmd);
}

exports.init = init;
