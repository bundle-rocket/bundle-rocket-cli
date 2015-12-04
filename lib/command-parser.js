/**
 * @file 命令解析器
 * @author Sheeta(wuhayao@gmail.com)
 */

var yargs = require('yargs');

var argv = yargs.argv;

function parse() {
    var cmd;
    if (argv._ && argv._.length > 0) {
        console.log(argv._);
    }
    cmd = 123;
    return cmd;
}

exports.parse = parse;
