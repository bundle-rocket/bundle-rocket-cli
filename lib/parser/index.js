/**
 * @file all command parsers
 * @author leon(ludafa@outlook.com)
 */

var yargs = require('yargs');

var argsHelper = yargs.usage('$0 <command>').demand(1, 1).strict().wrap(null).help('help');

var parsers = [].concat(require('./main.js'), require('./server.js'), require('./user.js'), require('./bundle.js'));

var argv = parsers.reduce(function (allParsers, group) {
    return [].concat(allParsers, group.parsers);
}, []).reduce(function (helper, parser) {
    var name = parser.name;
    var description = parser.description;
    var parseArgs = parser.parseArgs;

    helper.command(name, description, parseArgs);
    return helper;
}, argsHelper).argv;

exports.actions = parsers.reduce(function (actions, parser) {
    return babelHelpers._extends({}, parser.actions, actions);
}, {});

exports.parse = function () {

    /* eslint-disable fecs-camelcase */
    var _ = argv._;
    var $0 = argv.$0;
    var args = babelHelpers.objectWithoutProperties(argv, ['_', '$0']);

    /* eslint-enable fecs-camelcase */

    var name = _[0];

    var commands = _.slice(1);

    var parse = parsers[name];

    if (!parse) {
        argsHelper.showHelp();
        return null;
    }

    var command = parse(commands, args);

    if (!command) {
        argsHelper.showHelp();
        return null;
    }

    return command;
};