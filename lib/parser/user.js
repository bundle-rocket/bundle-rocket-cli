/**
 * @file user command parser
 * @author leon(ludafa@outlook.com)
 */

var actions = {
    LOGIN: 'LOGIN',
    LOGOUT: 'LOGOUT',
    REGISTER: 'REGISTER'
};

var parsers = [{
    name: 'login',
    description: 'login to a bundle rocket server',
    parseArgs: function parseArgs(yargs) {
        yargs.demand(2, 2).usage('bundle-rocket login <server-url>').example('bundle-rocket login http://bundle-rocket.org');
    },
    parse: function parse(_ref, options) {
        var serverURL = _ref[0];

        return {
            type: actions.LOGIN,
            payload: babelHelpers._extends({}, options, {
                serverURL: serverURL
            })
        };
    }
}, {
    name: 'logout',
    description: 'logout from current bundle rocket server',
    parseArgs: function parseArgs(yargs) {
        yargs.demand(1, 2).usage('bundle-rocket logout [server-url]').example('bundle-rocket logout http://bundle-rocket.org');
    },
    parse: function parse(_ref2, options) {
        var serverURL = _ref2[0];

        return {
            type: actions.LOGOUT,
            payload: babelHelpers._extends({}, options, {
                serverURL: serverURL
            })
        };
    }
}, {
    name: 'register',
    description: 'register an account to a bundle rocket server',
    parseArgs: function parseArgs(yargs) {},
    parse: function parse(commands, args) {
        return {
            type: actions.REGISTER
        };
    }
}];

module.exports = {
    actions: actions,
    parsers: parsers
};