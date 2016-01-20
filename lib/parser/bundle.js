/**
 * @file bundle command pasrser
 * @author leon(ludafa@outlook.com)
 */

var actions = exports.actions = {
    REMOVE: 'REMOVE',
    LIST: 'LIST',
    PUBLISH: 'PUBLISH',
    DEPLOY: 'DEPLOY'
};

exports.parsers = [{
    name: 'remove',
    description: 'Remove the bundle',
    parseArgs: function parseArgs(yargs) {
        yargs.wrap(null).usage('$0 remove <version> <bundle>').example('$0 remove 1.0.0').demand(3, 3);
    },
    parse: function parse(_ref, options) {
        var version = _ref[0];

        return {
            type: actions.REMOVE,
            payload: babelHelpers._extends({}, options, {
                version: version
            })
        };
    }
}, {
    name: 'list',
    description: 'List all the bundles of this app',
    parseArgs: function parseArgs(yargs) {
        yargs.wrap(null).usage('$0 list [--server-name server-name]').example('$0 list');
    },
    parse: function parse(_ref2, options) {
        var serverName = _ref2[0];

        return {
            type: actions.LIST,
            payload: babelHelpers._extends({}, options, {
                serverName: serverName
            })
        };
    }
}, {
    name: 'publish',
    description: 'Publish the bundle to bundle-rocket server',
    parseArgs: function parseArgs(yargs) {
        yargs.usage('$0 publish <version> <bundle> [--server-name server-name]').example('$0 publish 1.0.0 ./bundle --server-name my-bundle-rocket').demand(3, 3).wrap(null);
    },
    parse: function parse(_ref3, options) {
        var version = _ref3[0];
        var bundlePath = _ref3[1];

        return {
            type: actions.PUBLISH,
            payload: babelHelpers._extends({}, options, {
                bundlePath: bundlePath,
                version: version
            })
        };
    }
}, {
    name: 'deploy',
    description: 'Deploy your bundle to all native apps',
    parseArgs: function parseArgs(yargs) {
        yargs.usage('$0 deploy <version>').example('$0 deploy 1.0.0').wrap(null).demand(3, 3);
    },
    parse: function parse(_ref4, options) {
        var version = _ref4[0];

        return {
            type: actions.DEPLOY,
            payload: babelHelpers._extends({}, options, {
                version: version
            })
        };
    }
}];