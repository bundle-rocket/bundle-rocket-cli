/**
 * @file app command parser
 * @author leon(ludafa@outlook.com)
 */

const actions = {
    APP_INIT: 'APP_INIT',
    APP_VIEW: 'APP_VIEW'
};

const parsers = [
    {
        name: 'init',
        description: 'Initialize an app package information',
        parseArgs(yargs) {
            yargs
                .demand(1, 1)
                .usage('$0 init');
        },
        parse(_, args) {
            return {
                type: 'APP_INIT',
                payload: args
            };
        }
    },
    {
        name: 'view',
        description: 'View registry info',
        parseArgs(yargs) {
            yargs
                .example('$0 view <name>')
                .usage('$0 view my-demo')
                .demand(2, 2);
        },
        parse([appName], options) {
            return {
                type: actions.APP_VIEW,
                payload: {
                    ...options,
                    appName
                }
            };
        }
    }
];

module.exports = {
    actions,
    parsers
};
