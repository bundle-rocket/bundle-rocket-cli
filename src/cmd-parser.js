/**
 * @file 命令解析器
 * @author Sheeta(wuhayao@gmail.com)
 */

import {argv} from 'yargs';

export function parse() {
    let cmd = {};
    if (argv._ && argv._.length > 0) {
        let arg0 = argv._[0];
        let arg1 = argv._[1];
        let arg2 = argv._[2];
        let arg3 = argv._[3];
        let arg4 = argv._[4];
        let arg5 = argv._[5];

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
                    case 'detail':
                        cmd.type = 'appDetail';
                        cmd.appName = arg2;
                        break;
                    case 'remove':
                    case 'rm':
                        cmd.type = 'appRemove';
                        cmd.appName = arg2;
                        break;
                    case 'rename':
                        cmd.type = 'appRename';
                        cmd.appName = arg2;
                        break;
                }
                break;
            case 'bundle':
                switch (arg1) {
                    case 'list':
                    case 'ls':
                        cmd.type = 'bundleList';
                        cmd.appName = arg2;
                        break;
                    case 'add':
                        cmd.type = 'bundleAdd';
                        cmd.appName = arg2;
                        cmd.bundleVersion = arg3;
                        cmd.bundleDir = arg4;
                        break;
                }
                break;
            default:
                return null;
        }
    }
    return cmd;
};
