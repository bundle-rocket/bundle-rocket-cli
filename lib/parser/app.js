/**
 * @file app command parser
 * @author leon(ludafa@outlook.com)
 */

const {name} = require('../conf');
const {compose} = require('./helper.js');
const PARSER_NAME = 'app';

module.exports = [{
    name: PARSER_NAME,
    description: 'app manangement',
    parseArgs(yargs) {
        yargs
            .usage(`${name} ${PARSER_NAME} <command>`)
            .demand(2, 2)
            .command('add', 'Add a new app to your account', function (yargs) {
                yargs
                    .usage('bundle-rocket app add <app-name>')
                    .example('bundle-rocket app add demo-app')
                    .demand(3, 3);
            })
            .command('remove', 'Remove an app from your account', function (yargs) {
                yargs
                    .demand(3, 3)
                    .usage('bundle-rocket app remove <app-name>')
                    .example('bundle-rocket app remove demo-app');
            })
            .command('list', 'List all the apps from your account', function () {
                yargs
                    .demand(2, 2)
                    .example('bundle-rocket app list');
            })
            .command('detail', 'View the detail of an app', function (yargs) {
                yargs
                    .demand(3, 3)
                    .usage('bundle-rocket app detail <app-name> ')
                    .example('bundle-rocket app detail demo-app');
            })
            .command('rename', 'Rename an app', function (yargs) {
                yargs
                    .demand(4, 4)
                    .usage('bundle-rocket app rename <source> <target>')
                    .example('bundle-rocket app rename demp-app my-app');
            });
    },
    parse: compose(PARSER_NAME, {

        add([appName], options) {
            return {
                type: 'APP_ADD',
                payload: {...options, appName}
            };
        },

        remove([appName], options) {
            return {
                type: 'APP_REMOVE',
                payload: {...options, appName}
            };
        },

        list(_, options) {
            return {
                type: 'APP_LIST',
                payload: options
            };
        },

        detail([appName], options) {
            return {
                type: 'APP_DETAIL',
                payload: {...options, appName}
            };
        },

        rename([from, to], options) {
            return {
                type: 'APP_RENAME',
                payload: {...options, from, to}
            };
        }

    })
}];
