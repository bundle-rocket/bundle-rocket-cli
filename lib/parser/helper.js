/**
 * @file parser create tool
 * @author leon(ludafa@outlook.com)
 */

exports.compose = function (name, config) {

    return function (_ref, options) {
        var command = _ref[0];

        var rest = _ref.slice(1);

        var handler = config[command];

        return handler ? handler(rest, options) : null;
    };
};