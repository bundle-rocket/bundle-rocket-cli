/**
 * @file user command parser
 * @author leon(ludafa@outlook.com)
 */

module.exports = [{
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
            type: 'LOGIN',
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
            type: 'LOGOUT',
            payload: {
                ...options,
                serverURL
            }
        };
    }
}, {
    name: 'register',
    description: 'register an account to a bundle rocket server',
    parseArgs(yargs) {},
    parse(commands, args) {
        return {
            type: 'REGISTER'
        };
    }
}];
