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
            .demand(1, 1)
            .usage('bundle-rocket login')
            .example('bundle-rocket login');
    },
    parse(_, options) {
        return {
            type: actions.LOGIN,
            payload: options
        };
    }
}, {
    name: 'logout',
    description: 'logout from current bundle rocket server',
    parseArgs(yargs) {
        yargs
            .demand(1, 1)
            .usage('bundle-rocket logout')
            .example('bundle-rocket logout');
    },
    parse(_, options) {
        return {
            type: actions.LOGOUT,
            payload: options
        };
    }
}, {
    name: 'register',
    description: 'register an account to a bundle rocket server',
    parseArgs(yargs) {
        yargs
            .demand(1, 1)
            .usage('$0 register')
            .example('$0 register');
    },
    parse(_, args) {
        return {
            type: actions.REGISTER,
            payload: {
                ...args
            }
        };
    }
}];

module.exports = {
    actions,
    parsers
};
