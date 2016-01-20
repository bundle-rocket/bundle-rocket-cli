/**
 * @file main parser
 * @author leon(ludafa@outlook.com)
 */

const actions = exports.actions = {
    INIT: 'INIT'
};

exports.parsers = [{

    name: 'init',
    description: 'init a bundle-rocket app configuration',
    parseArgv(yargs) {

        yargs
            .demand(2, 2)
            .usage('bundle-rocket init')
            .help('help');

    },
    parse(_, options) {
        return {
            type: actions.INIT,
            options
        };
    }

}];
