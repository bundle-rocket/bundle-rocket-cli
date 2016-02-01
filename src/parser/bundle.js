/**
 * @file bundle command pasrser
 * @author leon(ludafa@outlook.com)
 */

const actions = exports.actions = {
    PUBLISH: 'PUBLISH',
    UNPUBLISH: 'UNPUBLISH',
    DEPLOY: 'DEPLOY',
    VERSION: 'VERSION'
};

exports.parsers = [
    {
        name: 'version',
        description: 'Bump a bundle version',
        parseArgs(yargs) {
            yargs
                .usage(''
                    + '$0 version '
                    + '['
                    +     '<nerversion> | major | minor | patch | '
                    +     'premajor | preminor | prepatch | prerelease'
                    + ']'
                )
                .wrap(null)
                .demand(2, 2);
        },
        parse([version], args) {
            return {
                type: actions.VERSION,
                payload: {
                    ...args,
                    version
                }
            };
        }
    },
    {
        name: 'publish',
        description: 'Publish the bundle to bundle-rocket server',
        parseArgs(yargs) {
            yargs
                .usage('$0 publish [<bundle-path>]')
                .example('$0 publish ./bundle')
                .example('$0 publish')
                .demand(1, 2)
                .wrap(null);
        },
        parse([bundlePath], options) {
            return {
                type: actions.PUBLISH,
                payload: {
                    ...options,
                    bundlePath
                }
            };
        }
    },
    {
        name: 'unpublish',
        description: 'Unpublish the bundle',
        parseArgs(yargs) {
            yargs
                .wrap(null)
                .usage('$0 Unpublish <version> <bundle>')
                .example('$0 Unpublish 1.0.0')
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
    },
    {
        name: 'deploy',
        description: 'Deploy your bundle to all native apps',
        parseArgs(yargs) {
            yargs
                .usage('$0 deploy <version>')
                .example('$0 deploy 1.0.0')
                .wrap(null)
                .demand(2, 2);
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
    }
];
