'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _chalk = require('chalk');

var _chalk2 = _interopRequireDefault(_chalk);

var _cmdParser = require('./cmd-parser');

var _cmdParser2 = _interopRequireDefault(_cmdParser);

var _cmdExecuter = require('./cmd-executer');

var _cmdExecuter2 = _interopRequireDefault(_cmdExecuter);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function init() {
    var cmd = _cmdParser2.default.parse();
    if (!cmd) {
        console.log(_chalk2.default.red('[ERROR]') + ' Please use correct command');
        return;
    }
    // executer.execute(cmd);
} /**
   * @file 主函数
   * @author Sheeta(wuhayao@gmail.com)
   */

exports.default = init;