/**
 * @file session
 * @author Sheeta(wuhayao@gmail.com)
 * @author leon(ludafa@outlook.com)
 */

const {getUserConfig, saveUserConfig} = require('./config.js');
const logger = require('../logger.js');

/**
 * 保存 session 信息到 .bundle-rocket.json 文件中
 *
 * @param {string} email 邮箱地址
 * @param {string} registry 服务器地址
 * @param {string} accessToken 授权码
 * @return {Promise}
 */
exports.addAccessToken = function (email, registry, accessToken) {

    return getUserConfig().then(function (conf) {

        const {servers = []} = conf;

        const newServer = {email, registry, accessToken};

        for (let i = 0, len = servers.length; i < len; ++i) {
            if (servers[i].registry === registry && email === servers[i].email) {
                return saveUserConfig({
                    ...conf,
                    servers: [
                        ...servers.slice(0, i),
                        newServer,
                        ...servers.slice(i + 1)
                    ]
                });
            }
        }

        return saveUserConfig({
            ...conf,
            servers: [...servers, newServer]
        });

    });

};

/**
 * 删除本地 session 信息
 *
 * @param {Object} options 参数
 * @param {string} options.registry 服务器地址
 * @return {Promise}
 */
exports.removeAccessToken = function (options) {

    const {registry} = options;

    return getUserConfig().then(function (conf) {

        const {servers = []} = conf;

        return saveUserConfig({
            ...conf,
            servers: servers.filter(function (server) {

                console.log(server, registry);

                return server.registry !== registry;
            })
        });

    });

};

/**
 * 获取 session token
 *
 * @param {?string} registry 服务器地址
 * @return {Promise}
 */
exports.getAccessToken = function (registry) {

    return getUserConfig().then(function (conf) {
        return exports.resolveAccessToken(registry || conf.registry, conf.servers);
    });

};

exports.resolveAccessToken = function (registry, servers) {

    if (!servers || !servers.length) {
        return null;
    }

    const currentRegistry = servers.length === 1 || !registry
        ? servers[0]
        : servers.find(function (server) {
            return server.registry === registry;
        });

    return currentRegistry ? currentRegistry.accessToken : null;

};
