/**
 * @file gulp babel@5 plugin
 * @author leon(ludafa@outlook.com)
 */

'use strict';

const path = require('path');
const through = require('through2');
const babel = require('babel-core');
const gutil = require('gulp-util');

module.exports = function (options) {

    options = options || {};

    let usedHelpers = [];

    function transform(file, encoding, callback) {

        if (file.isNull()) {
            callback(null, file);
            return;
        }

        if (file.isStream()) {
            callback(new gutil.PluginError('gulp-babel', 'Streaming not supported'));
            return;
        }

        try {

            const result = babel.transform(
                file.contents.toString(),
                Object.assign(
                    {},
                    options,
                    {
                        filename: file.path
                    }
                )
            );

            let code = result.code;

            if (result.metadata.usedHelpers.length) {

                const babelHelperFullPath = path.join(file.base, './babelHelpers.js');

                let babelHelperRelativePath = path.relative(
                    path.dirname(file.path),
                    babelHelperFullPath
                );

                if (babelHelperRelativePath.charAt(0) !== '.') {
                    babelHelperRelativePath = './' + babelHelperRelativePath;
                }

                code = ''
                    + 'var babelHelpers = require(\'' + babelHelperRelativePath + '\');\n'
                    + code;

                usedHelpers = usedHelpers.concat(result.metadata.usedHelpers);

            }

            file.contents = new Buffer(code);

            file.babel = result.metadata;

            this.push(file);

        }
        catch (err) {
            this.emit('error', new gutil.PluginError('gulp-babel', err, {
                fileName: file.path,
                showProperties: false
            }));
        }

        callback();
    }

    function flush(callback) {

        if (!usedHelpers.length) {
            return;
        }

        var file = new gutil.File({
            path: 'babelHelpers.js',
            contents: new Buffer(''
                + babel.buildExternalHelpers(usedHelpers, 'var')
                + '\nmodule.exports = babelHelpers;'
            )
        });

        this.push(file);
        callback();

    }

    return through.obj(transform, flush);

};
