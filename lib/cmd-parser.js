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

        switch (arg0) {
            case 'register':
                cmd.type = arg0;
                break;
            case 'login':
                cmd.type = arg0;
                break;
            case 'logout':
                cmd.type = arg0;
                break;
            case 'app':
                switch (arg1) {
                    case 'list':
                    case 'ls':
                        cmd.type = 'appList';
                        break;
                    case 'add':
                        cmd.type = 'appAdd';
                        cmd.appName = arg2;
                        break;
                    case 'remove':
                    case 'rm':
                        cmd.type = 'appRemove';
                        cmd.appName = arg2;
                        break;
                }
                break;
            default:
                return null;
        }
    }
    return cmd;
}

exports.parse = parse;
