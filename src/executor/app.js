/**
 * @file app executor
 * @author Sheeta(wuhayao@gmail.com)
 * @author leon(ludafa@outlook.com)
 */

const chalk = require('chalk');
const {printTable} = require('../util.js');
const {valid} = require('semver');

const {add, get, list, remove, createConf} = require('../dao/app');

const path = require('path');
const prompt = require('prompt');
const logger = require('../logger.js');
const {getConfig} = require('../dao/config.js');

function appInit(command) {

    let pkg = {};

    try {
        pkg = require(path.join(process.cwd(), 'package.json'));
    }
    catch (error) {}

    prompt.start();

    const schema = {
        properties: {
            name: {
                'default': pkg.name || path.dirname(process.cwd),
                'message': 'Enter input a app name',
                'required': true
            },
            version: {
                'name': 'version',
                'default': pkg.version || '1.0.0',
                'description': 'Enter your bundle version',
                'message': `please input a valid ${chalk.blue('semver')} version`,
                'required': true,
                'conform'(value) {
                    return valid(value);
                }
            },
            appVersion: {
                'default': pkg.version || '1.0.0',
                'message': `please input a valid ${chalk.blue('semver')} version`,
                'required': true,
                'conform'(value) {
                    return valid(value);
                }
            }
        }
    };

    prompt.get(schema, function (error, result) {

        if (error) {
            return;
        }

        createConf(result)
            .then(function () {
                logger.info(`${chalk.green('bundle-rocket.json')} created`);
            })
            .catch(function (error) {
                logger.error(error.message);
            });

    });

}

function appView({payload = {}}) {

    const {appName, ...rest} = payload;

    return getConfig()
        .then(function (config) {
            return get(appName, {...config, ...rest});
        })
        .then(function (app) {
            logger.info(`\n${JSON.stringify(app, null, 4)}`);
        })
        .catch(function (error) {
            logger.error(error.message);
        });

}

module.exports = {
    appInit,
    appView
};
