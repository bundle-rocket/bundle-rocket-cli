/**
 * @file main parser
 * @author leon(ludafa@outlook.com)
 */

module.exports = [{

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
            type: 'INIT',
            options
        };
    }

}];
