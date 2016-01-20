/**
 * @file gulp babel@5 plugin
 * @author leon(ludafa@outlook.com)
 */

const through = require('through2');
const babel = require('babel-core');
const gutil = require('gulp-util');

module.exports = function (options) {

    options = options || {};

    return through.obj(function (file, encoding, callback) {

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

            if (!result.ignored) {
                file.contents = new Buffer(result.code);
            }

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

    });

};
