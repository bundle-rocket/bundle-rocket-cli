/**
 * @file 命令解析器
 * @author Sheeta(wuhayao@gmail.com)
 */


function parse() {

    console.log(argv);
    console.log(12321);

    // if (!argv._.length) {
    //     return null;
    // }

    // var cmd = {};

    // const [
    //     arg0,
    //     arg1,
    //     arg2,
    //     arg3,
    //     arg4
    // ] = argv._;

    // switch (arg0) {
    //     case 'register':
    //     case 'login':
    //     case 'logout':
    //         cmd.type = arg0;
    //         break;
    //     case 'app':
    //         switch (arg1) {
    //             case 'list':
    //             case 'ls':
    //                 cmd.type = 'appList';
    //                 break;
    //             case 'add':
    //                 cmd.type = 'appAdd';
    //                 cmd.appName = arg2;
    //                 break;
    //             case 'detail':
    //                 cmd.type = 'appDetail';
    //                 cmd.appName = arg2;
    //                 break;
    //             case 'remove':
    //             case 'rm':
    //                 cmd.type = 'appRemove';
    //                 cmd.appName = arg2;
    //                 break;
    //             case 'rename':
    //                 cmd.type = 'appRename';
    //                 cmd.appName = arg2;
    //                 break;
    //         }
    //         break;
    //     case 'bundle':
    //         switch (arg1) {
    //             case 'list':
    //             case 'ls':
    //                 cmd.type = 'bundleList';
    //                 cmd.appName = arg2;
    //                 break;
    //             case 'add':
    //                 cmd.type = 'bundleAdd';
    //                 cmd.appName = arg2;
    //                 cmd.bundleVersion = arg3;
    //                 cmd.bundleDir = arg4;
    //                 break;
    //         }
    //         break;
    //     default:
    //         return null;
    // }

    // return cmd;
}

exports.parse = parse;
