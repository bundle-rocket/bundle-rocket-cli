/**
 * @file 主函数
 * @author Sheeta(wuhayao@gmail.com)
 */

var _require = require('./parser');

var parse = _require.parse;

var _require2 = require('./executor');

var execute = _require2.execute;

var command = parse();
console.log(command);