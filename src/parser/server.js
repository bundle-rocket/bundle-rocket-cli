/**
 * @file server command parser
 * @author leon(ludafa@outlook.com)
 */

const {compose} = require('./helper');

const actions = exports.actions = {
    SERVER_ADD: 'SERVER_ADD',
    SERVER_REMOVE: 'SERVER_REMOVE',
    SERVER_LIST: 'SERVER_LIST',
    SERVER_DETAIL: 'SERVER_DETAIL'
};

exports.parsers = [{
    name: 'server',
    description: 'remote bundle rocket server manangement',
    parseArgs(yargs) {

        yargs
            .usage('$0 server <command>')
            .demand(2, 2)
            .command('add', 'add a bundle-rocket server', function (yargs) {
                yargs
                    .wrap(null)
                    .demand(4, 4)
                    .usage('$0 server add <server-name> <server-url>')
                    .example('$0 server add origin http://bundle-rocket.org');
            })
            .command('remove', 'remove a bundle-rocket server', function () {
                yargs
                    .wrap(null)
                    .demand(3, 3)
                    .usage('$0 server remove <server-name>')
                    .example('$0 server remove origin');
            })
            .command('list', 'list all the bundle-rocket servers of your app', function (yargs) {
                yargs
                    .wrap(null)
                    .demand(3, 3)
                    .usage('$0 server list');
            })
            .command('detail', 'show the detail of a bundle-rocket server', function (yargs) {
                yargs
                    .wrap(null)
                    .demand(4, 4)
                    .usage('$0 server detail <server-name>')
                    .example('$0 server detail my-server');
            });

    },

    parse: compose('server', {

        add([serverName, serverURL], options) {
            return {
                type: actions.SERVER_ADD,
                payload: {
                    ...options,
                    serverName,
                    serverURL
                }
            };
        },

        remove([serverName], options) {
            return {
                type: actions.SERVER_REMOVE,
                payload: {
                    ...options,
                    serverName
                }
            };
        },

        list(_, options) {
            return {
                type: actions.SERVER_LIST,
                payload: {
                    ...options
                }
            };
        },

        detail([serverName], options) {
            return {
                type: actions.SERVER_DETAIL,
                payload: {
                    ...options,
                    serverName
                }
            };
        }

    })

}];
