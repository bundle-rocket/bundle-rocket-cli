/**
 * @file server command parser
 * @author leon(ludafa@outlook.com)
 */

var _require = require('./helper');

var compose = _require.compose;

var actions = exports.actions = {
    SERVER_ADD: 'SERVER_ADD',
    SERVER_REMOVE: 'SERVER_REMOVE',
    SERVER_LIST: 'SERVER_LIST',
    SERVER_DETAIL: 'SERVER_DETAIL'
};

exports.parsers = [{
    name: 'server',
    description: 'remote bundle rocket server manangement',
    parseArgs: function parseArgs(yargs) {

        yargs.usage('$0 server <command>').demand(2, 2).command('add', 'add a bundle-rocket server', function (yargs) {
            yargs.wrap(null).demand(4, 4).usage('$0 server add <server-name> <server-url>').example('$0 server add origin http://bundle-rocket.org');
        }).command('remove', 'remove a bundle-rocket server', function () {
            yargs.wrap(null).demand(3, 3).usage('$0 server remove <server-name>').example('$0 server remove origin');
        }).command('list', 'list all the bundle-rocket servers of your app', function (yargs) {
            yargs.wrap(null).demand(3, 3).usage('$0 server list');
        }).command('detail', 'show the detail of a bundle-rocket server', function (yargs) {
            yargs.wrap(null).demand(4, 4).usage('$0 server detail <server-name>').example('$0 server detail my-server');
        });
    },

    parse: compose('server', {

        add: function add(_ref, options) {
            var serverName = _ref[0];
            var serverURL = _ref[1];

            return {
                type: actions.SERVER_ADD,
                payload: babelHelpers._extends({}, options, {
                    serverName: serverName,
                    serverURL: serverURL
                })
            };
        },

        remove: function remove(_ref2, options) {
            var serverName = _ref2[0];

            return {
                type: actions.SERVER_REMOVE,
                payload: babelHelpers._extends({}, options, {
                    serverName: serverName
                })
            };
        },

        list: function list(_, options) {
            return {
                type: actions.SERVER_LIST,
                payload: babelHelpers._extends({}, options)
            };
        },

        detail: function detail(_ref3, options) {
            var serverName = _ref3[0];

            return {
                type: actions.SERVER_DETAIL,
                payload: babelHelpers._extends({}, options, {
                    serverName: serverName
                })
            };
        }

    })

}];