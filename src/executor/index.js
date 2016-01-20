/**
 * @file executor main
 * @author Sheeta(wuhayao@gmail.com)
 * @author leon(ludafa@outlook.com)
 */

const executors = {
    ...require('./app.js'),
    ...require('./bundle.js'),
    ...require('./user.js')
};

exports.execute = function (cmd) {

    const {type} = cmd;
    const executor = executors[type];

    if (executor) {
        return executor(cmd);
    }

};
