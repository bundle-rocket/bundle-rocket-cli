/**
 * @file app dao
 * @author leon(ludafa@outlook.com)
 */

const {getToken} = require('../session.js');
const {serverURL} = require('../conf.js');

exports.add = function (name) {

    return getToken()
        .then(function (token) {
            return fetch(`${serverURL}/apps`, {
                method: 'POST',
                headers: {
                    'content-type': 'application/json',
                    'accept-type': 'application/json',
                    'authorization': `Bearer ${token}`
                },
                body: JSON.stringify({name})
            });
        })
        .then(function (response) {
            return response.json();
        });

};

exports.get = function (nameOrId) {

    return getToken()
        .then(function (token) {
            return fetch(`${serverURL}/apps/${nameOrId}`, {
                method: 'GET',
                headers: {
                    'content-type': 'application/json',
                    'accept-type': 'application/json',
                    'authorization': `Bearer ${token}`
                }
            });
        })
        .then(function (response) {
            return response.json();
        });

};

exports.list = function () {

    return getToken()
        .then(function (token) {
            return fetch(`${serverURL}/apps`, {
                method: 'GET',
                headers: {
                    'content-type': 'application/json',
                    'accept-type': 'application/json',
                    'authorization': `Bearer ${token}`
                }
            });
        })
        .then(function (response) {
            return response.json();
        });

};

exports.remove = function (nameOrId) {

    return getToken()
        .then(function (token) {
            return fetch(`${serverURL}/apps/${nameOrId}`, {
                method: 'DELETE',
                headers: {
                    'content-type': 'application/json',
                    'accept-type': 'application/json',
                    'authorization': `Bearer ${token}`
                }
            });
        })
        .then(function (response) {
            return response.json();
        });

};

const fs = require('fs');
const path = require('path');
const CONF_FILE_NAME = 'bundle-rocket.json';

exports.createConf = function (conf) {

    const confFilePath = path.join(process.cwd(), CONF_FILE_NAME);

    return new Promise(function (resolve, reject) {

        fs.writeFile(
            confFilePath,
            JSON.stringify(conf, null, 4),
            'utf8',
            function (err) {

                if (err) {
                    reject(err);
                    return;
                }

                resolve();

            }
        );

    });

};
