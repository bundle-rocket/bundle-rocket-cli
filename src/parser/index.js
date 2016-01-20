/**
 * @file all command parsers
 * @author leon(ludafa@outlook.com)
 */

const yargs = require('yargs');

const argsHelper = yargs
    .usage('$0 <command>')
    .demand(1, 1)
    .strict()
    .wrap(null)
    .help('help');

const parsers = [
    ...require('./main.js'),
    ...require('./server.js'),
    ...require('./user.js'),
    ...require('./bundle.js')
];

const argv = parsers
    .reduce(
        function (allParsers, group) {
            return [...allParsers, ...group.parsers];
        },
        []
    )
    .reduce(
        function (helper, parser) {
            const {name, description, parseArgs} = parser;
            helper.command(name, description, parseArgs);
            return helper;
        },
        argsHelper
    )
    .argv;

exports.actions = parsers
    .reduce(function (actions, parser) {
        return {
            ...parser.actions,
            ...actions
        };
    }, {});

exports.parse = function () {

    /* eslint-disable fecs-camelcase */
    const {
        _,
        $0,
        ...args
    } = argv;
    /* eslint-enable fecs-camelcase */

    const [name, ...commands] = _;

    const parse = parsers[name];

    if (!parse) {
        argsHelper.showHelp();
        return null;
    }

    const command = parse(commands, args);

    if (!command) {
        argsHelper.showHelp();
        return null;
    }

    return command;

};
