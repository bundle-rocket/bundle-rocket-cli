/**
 * @file app command parser
 * @author leon(ludafa@outlook.com)
 */

const actions = {
    APP_DETAIL: 'APP_DETAIL',
    APP_KEY: 'APP_KEY'
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

            });
    },
    parse: compose('app', {

        detail(_, options) {
            return {
                type: actions.APP_KEY,
                payload: options
            };
        },

        key(_, options) {
            return {
                type: actions.APP_DETAIL,
                payload: options
            };
        }

    })
}];

module.exports = {
    actions,
    parsers
};
