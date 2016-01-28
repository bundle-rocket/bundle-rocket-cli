/**
 * @file install script
 * @author leon(ludafa@outlook.com)
 */

var conf = require('../lib/conf.js');

conf
    .getGlobalConf()
    .then(function (conf) {

        conf = Object.assign(
            {registry: 'http://localhost:8080'},
            conf
        );

        return conf.saveGlobalConf(conf);

    });
