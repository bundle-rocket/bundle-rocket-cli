/**
 * @file executor main
 * @author Sheeta(wuhayao@gmail.com)
 * @author leon(ludafa@outlook.com)
 */

const executors = {
    ...require('./app.js'),
    ...require('./bundle.js'),
    ...require('./user.js'),
    ...require('./server.js'),
    ...require('./config.js')
};

exports.execute = function (command) {

    const {type} = command;
    const handlerName = type
        .split('_')
        .map(function (item, index) {
            item = item.toLowerCase();
            return index > 0
                ? item.slice(0, 1).toUpperCase() + item.slice(1)
                : item;
        })
        .join('');

    const executor = executors[handlerName];

    if (!executor) {
        throw new Error(`${handlerName} cannot match a executor`);
    }

    return executor(command);
};
