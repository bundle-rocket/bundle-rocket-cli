/**
 * @file bundle command pasrser
 * @author leon(ludafa@outlook.com)
 */

const actions = exports.actions = {
    REMOVE: 'REMOVE',
    LIST: 'LIST',
    PUBLISH: 'PUBLISH',
    DEPLOY: 'DEPLOY'
};

exports.parsers = [{
    name: 'remove',
    description: 'Remove the bundle',
    parseArgs(yargs) {
        yargs
            .wrap(null)
            .usage('$0 remove <version> <bundle>')
            .example('$0 remove 1.0.0')
            .demand(3, 3);
    },
    parse([version], options) {
        return {
            type: actions.REMOVE,
            payload: {
                ...options,
                version
            }
        };
    }
}, {
    name: 'list',
    description: 'List all the bundles of this app',
    parseArgs(yargs) {
        yargs
            .wrap(null)
            .usage('$0 list [--server-name server-name]')
            .example('$0 list');
    },
    parse([serverName], options) {
        return {
            type: actions.LIST,
            payload: {
                ...options,
                serverName
            }
        };
    }
}, {
    name: 'publish',
    description: 'Publish the bundle to bundle-rocket server',
    parseArgs(yargs) {
        yargs
            .usage('$0 publish <version> <bundle> [--server-name server-name]')
            .example('$0 publish 1.0.0 ./bundle --server-name my-bundle-rocket')
            .demand(3, 3)
            .wrap(null);
    },
    parse([version, bundlePath], options) {
        return {
            type: actions.PUBLISH,
            payload: {
                ...options,
                bundlePath,
                version
            }
        };
    }
}, {
    name: 'deploy',
    description: 'Deploy your bundle to all native apps',
    parseArgs(yargs) {
        yargs
            .usage('$0 deploy <version>')
            .example('$0 deploy 1.0.0')
            .wrap(null)
            .demand(3, 3);
    },
    parse([version], options) {
        return {
            type: actions.DEPLOY,
            payload: {
                ...options,
                version
            }
        };
    }
}];
