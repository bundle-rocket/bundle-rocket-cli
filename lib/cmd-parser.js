/**
 * @file 命令解析器
 * @author Sheeta(wuhayao@gmail.com)
 */

var yargs = require('yargs');

var BUNDLE_ROCKET_URL = 'http://localhost:8080';

var argv = yargs.argv;

function parse() {
    var cmd = {};
    if (argv._ && argv._.length > 0) {
        var arg0 = argv._[0];
        var arg1 = argv._[1];
        var arg2 = argv._[2];
        var arg3 = argv._[3];
        var arg4 = argv._[4];
        cmd.type = arg0;
        switch (arg0) {
            case 'register':
                break;
            case 'login':
                break;
            case 'logout':
                break;
            default:
                return null;
        }
    }
    return cmd;
}

exports.parse = parse;
