/**
 * @file user command parser
 * @author leon(ludafa@outlook.com)
 */

const actions = {
    LOGIN: 'LOGIN',
    LOGOUT: 'LOGOUT',
    REGISTER: 'REGISTER'
};

const parsers = [{
    name: 'login',
    description: 'login to a bundle rocket server',
    parseArgs(yargs) {
        yargs
            .demand(2, 2)
            .usage('bundle-rocket login <server-url>')
            .example('bundle-rocket login http://bundle-rocket.org');
    },
    parse([serverURL], options) {
        return {
            type: actions.LOGIN,
            payload: {
                ...options,
                serverURL
            }
        };
    }
}, {
    name: 'logout',
    description: 'logout from current bundle rocket server',
    parseArgs(yargs) {
        yargs
            .demand(1, 2)
            .usage('bundle-rocket logout [server-url]')
            .example('bundle-rocket logout http://bundle-rocket.org');
    },
    parse([serverURL], options) {
        return {
            type: actions.LOGOUT,
            payload: {
                ...options,
                serverURL
            }
        };
    }
}, {
    name: 'register',
    description: 'register an account to a bundle rocket server',
    parseArgs(yargs) {
        yargs
            .demand(2, 2)
            .usage('$0 register <server-url>')
            .example('$0 register http://bundle-rocket.org');
    },
    parse([serverURL], args) {
        return {
            type: actions.REGISTER,
            payload: {
                ...args,
                serverURL
            }
        };
    }
}];

module.exports = {
    actions,
    parsers
};
