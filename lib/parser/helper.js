/**
 * @file parser create tool
 * @author leon(ludafa@outlook.com)
 */

exports.compose = function (name, config) {

    return function ([command, ...rest], options) {

        const handler = config[command];

        return handler
            ? handler(rest, options)
            : null;

    };

};
