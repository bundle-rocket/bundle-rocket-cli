/**
 * @file 主函数
 * @author Sheeta(wuhayao@gmail.com)
 */

const {parse} = require('./parser');
const {execute} = require('./executor');

execute(parse());
