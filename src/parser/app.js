/**
 * @file app command parser
 * @author leon(ludafa@outlook.com)
 */

const actions = {
    APP_DETAIL: 'APP_DETAIL',
    APP_KEY: 'APP_KEY',
    APP_LIST: 'APP_LIST'
};

const {compose} = require('./helper.js');

const parsers = [{
    name: 'app',
    description: 'View the detail of the app',
    parseArgs(yargs) {
        yargs
            .demand(2, 2)
            .usage('$0 app <command>')
            .command('detail', 'View the app detail', function (yargs) {
                yargs
                    .usage('$0 app detail')
                    .example('$0 app detail');
            })
            .command('key', 'fetch the deployment key of this app', function (yargs) {
                yargs
                    .usage('$0 app key')
                    .example('$0 app key');
            })
            .command('list', 'List all the apps of your account', function (yargs) {
                yargs
                    .usage('$0 app list <server-url>')
                    .example('$0 app list http://bundle-rocket.org')
                    .demand(3, 3);
            });
    },
    parse: compose('app', {

        detail(_, options) {
            return {
                type: actions.APP_DETAIL,
                payload: options
            };
        },

        key(_, options) {
            return {
                type: actions.APP_KEY,
                payload: options
            };
        },

        list([serverURL], options) {
            return {
                type: actions.APP_LIST,
                payload: {
                    ...options,
                    serverURL
                }
            };
        }

    })
}];

module.exports = {
    actions,
    parsers
};
