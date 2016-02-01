/**
 * @file bundle command executor
 * @author leon(ludafa@outlook.com)
 */

const semver = require('semver');
const chalk = require('chalk');

const COMMANDS = {
    major: true,
    minor: true,
    patch: true,
    premajor: true,
    preminor: true,
    prepatch: true,
    prerelease: true
};

function isReservedVersion(version) {
    return COMMANDS[version];
}

const {getConfig} = require('../dao/config.js');
const {resolveAccessToken} = require('../dao/session.js');
const {get, save, getFilePath} = require('../dao/package.js');
const {publish, deploy} = require('../dao/bundle.js');
const path = require('path');
const logger = require('../logger.js');

exports.publish = function (command) {

    const {bundlePath, ...rest} = command.payload;

    Promise
        .all([getFilePath(), get(), getConfig()])
        .then(function ([root, pkg, config]) {

            const {name, version, appVersion} = pkg;
            const {directory, servers, registry} = config;
            const accessToken = resolveAccessToken(registry, servers);

            if (!accessToken) {
                console.error(''
                    + 'you haven\'t logined to any bundle rocket server. '
                    + 'Please login first'
                );
                return;
            }

            return publish(
                accessToken,
                {
                    bundleVersion: version,
                    bundlePath: path.join(
                        path.dirname(root),
                        bundlePath || directory
                    ),
                    appName: name,
                    appVersion
                },
                {...config, ...rest}
            ).then(function (bundle) {
                logger.info(`+${name}@${version}`);
                logger.verbose(`[bundle] [PUBLISH] succeed`, bundle);
            });

        })
        .catch(function (error) {
            logger.error(error.message);
        });

};


exports.version = function (command) {

    const {version, preid, ...rest} = command.payload;

    get().then(function (pkg) {

        const nextVersion = isReservedVersion(version)
            ? semver.inc(pkg.version, version, preid)
            : version;

        if (semver.gte(pkg.version, nextVersion)) {
            logger.warn(`${version} must be higher than current version ${nextVersion}`);
            return;
        }

        logger.verbose(`[bundle] [requestedVersion ${version}] [nextVerion ${nextVersion}]`);

        return save({...pkg, version: nextVersion})
            .then(function () {
                logger.info(`bump version to ${chalk.green(nextVersion)}`);
            });

    }).catch(function (error) {
        logger.error(`${chalk.red(error.message)}`);
    });


};

exports.deploy = function ({payload = {}} = {}) {

    const {version, ...rest} = payload;

    Promise.all([get(), getConfig()]).then(function ([pkg, config]) {
        const {name} = pkg;
        const combinedConfig = {...config, ...rest};
        const {servers, registry} = combinedConfig;
        const accessToken = resolveAccessToken(registry, servers);
        return deploy(accessToken, version, name, combinedConfig);
    }).then(function ({bundle}) {
        logger.verbose(`[bundle] [deploy]`, bundle);
        logger.info(`${version} deployed`);
    }).catch(function ({message}) {
        logger.error(message);
    });

};
