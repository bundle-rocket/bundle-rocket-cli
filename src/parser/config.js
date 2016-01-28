/**
 * @file configuration command parser
 * @author leon(ludafa@outlook.com)
 */

const {compose} = require('./helper.js');

const actions = {
    CONFIG_GET: 'CONFIG_GET',
    CONFIG_SET: 'CONFIG_SET',
    CONFIG_LIST: 'CONFIG_LIST',
    CONFIG_DELETE: 'CONFIG_DELETE'
};

const parsers = [{

    name: 'config',
    description: 'Configurate the app',
    parseArgs(yargs) {

        yargs
            .demand(1, 1)
            .usage('$0 config <command>')
            .command('get', 'Get bundle rocket configuration', function (yargs) {

                yargs
                    .demand(3, 3)
                    .usage('$0 config get <key>')
                    .example('$0 config get registry')
                    .option('global', {
                        'alias': 'g',
                        'describe': 'use the user configuration',
                        'default': false
                    });


            })
            .command('set', 'Update bundle rocket configuation', function (yargs) {

                yargs
                    .usage('$0 config set <key> <value>')
                    .example('$0 config set registry http://localhost:8080')
                    .demand(4, 4)
                    .option('global', {
                        'alias': 'g',
                        'describe': 'use the user configuration',
                        'default': false
                    });

            })
            .command('list', 'List all the configuations', function (yargs) {

                yargs
                    .demand(2, 2)
                    .usage('$0 config list')
                    .strict()
                    .option('global', {
                        'alias': 'g',
                        'describe': 'use the user configuration',
                        'default': false
                    });

            })
            .command('delete', 'Delete a configuation item', function (yargs) {

                yargs
                    .demand(3, 3)
                    .usage('$0 config delete <key>')
                    .example('$0 config delete registry')
                    .option('global', {
                        'alias': 'g',
                        'describe': 'use the user configuration',
                        'default': false
                    });

            })
            .option('global', {
                'alias': 'g',
                'describe': 'use the user configuration',
                'default': false
            });

    },
    parse: compose('config', {
        'get'([key], args) {
            return {
                type: actions.CONFIG_GET,
                payload: {
                    ...args,
                    key
                }
            };
        },
        'set'([key, value], args) {
            return {
                type: actions.CONFIG_SET,
                payload: {
                    ...args,
                    key,
                    value
                }
            };
        },
        'list'(_, args) {
            return {
                type: actions.CONFIG_LIST,
                payload: {
                    ...args
                }
            };
        },
        'delete'([key], args) {
            return {
                type: actions.CONFIG_DELETE,
                payload: {
                    ...args,
                    key
                }
            };
        }
    })
}];

module.exports = {
    actions,
    parsers
};
