/**
 * @file server command executor
 * @author leon(ludafa@outlook.com)
 */

const {getConf, saveConf} = require('../conf.js');
const {printTable} = require('../util.js');

exports.serverList = function (command) {

    getConf()
        .then(function (conf) {
            const {servers} = conf;

            if (!servers) {
                console.log('your app haven\'t add to any server');
                console.log('you may try `bundle-rocket server add <server-name> <server-url>`');
                return;
            }


            printTable(
                ['INDEX', 'SERVER', 'URL'],
                function (dataSource) {
                    servers.reduce(function (dataSource, record, index) {
                        const {name, url} = record;
                        dataSource.push([index + 1, name, url]);
                        return dataSource;
                    }, dataSource);
                }
            );


        })
        .catch(function (error) {
            console.error(error.message);
        });

};

const chalk = require('chalk');

exports.serverAdd = function (command) {

    const {serverName, serverURL} = command.payload;

    getConf().then(function (conf) {

        const {servers = []} = conf;

        for (var i = 0, len = servers.length; i < len; ++i) {

            if (servers[i].name === serverName) {
                console.error(`server ${chalk.red(serverName)} already exists, please remove it first`);
                return;
            }

        }

        return saveConf({
            ...conf,
            servers: [...servers, {name: serverName, url: serverURL}]
        }).then(function () {
            console.log(`server ${chalk.green(serverName)}[${chalk.blue(serverURL)}] has been added.`);
        });

    })
    .catch(function (error) {
        console.error(error.stack);
    });

};

exports.serverRemove = function (command) {

    const {serverName} = command.payload;

    getConf().then(function (conf) {

        const {servers = []} = conf;

        const nextServers = servers.filter(function (record) {
            return record.name !== serverName;
        });

        if (nextServers.length === servers.length) {
            console.error(`cannot find server with name ${serverName}`);
            return;
        }

        return saveConf({...conf, servers: nextServers}).then(function () {
            console.log(`server ${chalk.red(serverName)} has been removed`);
        });


    })
    .catch(function (error) {
        console.error(error.message);
    });

};
