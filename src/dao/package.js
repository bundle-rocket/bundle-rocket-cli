/**
 * @file package information dao
 * @author leon(ludafa@outlook.com)
 */

const {findAncestor, readJSON, writeJSON} = require('../util.js');

const PACKAGE_FILE_NAME = 'bundle-rocket.json';

exports.getFilePath = function () {
    return findAncestor(PACKAGE_FILE_NAME);
};

exports.get = function () {

    return exports.getFilePath()
        .then(function (filePath) {
            return readJSON(filePath);
        });

};

exports.save = function (pkg) {

    return exports.getFilePath()
        .then(function (filePath) {
            return writeJSON(filePath, pkg);
        });

};
