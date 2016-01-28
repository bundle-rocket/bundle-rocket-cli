/**
 * @file conf
 * @author leon(ludafa@outlook.com)
 */

const path = require('path');

const CONFIG_FILE_NAME = '.brrc';

const defaults = require('../bundle-rocket.json');

const {findAncestor, readJSON, writeJSON} = require('../util.js');

const logger = require('../logger.js');

function findProjectConfigFilePath(start) {
    return findAncestor(CONFIG_FILE_NAME);
}

function getProjectConfig() {
    return findProjectConfigFilePath()
        .then(function (confFilePath) {
            return readJSON(confFilePath);
        })
        .catch(function (error) {
            if (error.status === 404) {
                return {};
            }
            throw error;
        });
}

function saveProjectConfig(conf) {
    return findProjectConfigFilePath().then(function (confFilePath) {
        return writeJSON(confFilePath, conf);
    }, function () {
        return writeJSON(path.join(process.cwd(), CONFIG_FILE_NAME), conf);
    });
}

const GLOBAL_USER_PATH = path.join(
    process.env.LOCALAPPDATA || process.env.HOME,
    CONFIG_FILE_NAME
);

function getUserConfig() {
    return readJSON(GLOBAL_USER_PATH)
        .catch(function (error) {
            if (error.status === 404) {
                return {};
            }
            throw error;
        });
}

function saveUserConfig(config) {
    return writeJSON(GLOBAL_USER_PATH, config).then(function () {
        logger.verbose(`[config] [save] user configuration updated:`, config);
    });
}

function getConfig(global) {

    return Promise.all([
        global ? Promise.resolve({}) : getProjectConfig(),
        getUserConfig()
    ]).then(function ([projectConfig, userConfig]) {
        return {...defaults, ...userConfig, ...projectConfig};
    });

}

module.exports = {
    defaults,
    getConfig,
    getProjectConfig,
    saveProjectConfig,
    getUserConfig,
    saveUserConfig
};
