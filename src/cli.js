/**
 * @file 主函数
 * @author Sheeta(wuhayao@gmail.com)
 */

import chalk from 'chalk';
import parser from './cmd-parser';
import executer from './cmd-executer';

function init() {
    let cmd = parser.parse();
    if (!cmd) {
        console.log(chalk.red('[ERROR]') + ' Please use correct command');
        return;
    }
    executer.execute(cmd);
}

export default init;
