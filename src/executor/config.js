/**
 * @file configuation command executor
 * @author leon(ludafa@outlook.com)
 */

const {
    getProjectConfig,
    getUserConfig,
    saveProjectConfig,
    saveUserConfig,
    getConfig
} = require('../dao/config.js');

exports.configGet = function ({payload = {}}) {

    const {key, global} = payload;

    getConfig(global).then(function (config) {
        console.log(config[key]);
    }).catch(function (error) {
        console.error(error.message);
    });

};

exports.configList = function ({payload = {}}) {

    const {global} = payload;

    getConfig(global).then(function (config) {
        console.log(config);
    }).catch(function (error) {
        console.error(error.message);
    });

};

exports.configSet = function ({payload = {}}) {

    const {key, value, global} = payload;

    const get = global ? getUserConfig : getProjectConfig;

    get().then(function (config) {

        const handler = global ? saveUserConfig : saveProjectConfig;

        return handler({
            ...config,
            [key]: value
        });

    }).catch(function (error) {
        console.error(error.message);
    });

};

exports.configDelete = function ({payload = {}}) {

    const {key, global} = payload;

    const get = global ? getUserConfig : getProjectConfig;

    get().then(function (config) {

        const handler = global ? saveUserConfig : saveProjectConfig;

        let cloneConfig = {...config};

        delete cloneConfig[key];

        return handler(cloneConfig);

    });

};
