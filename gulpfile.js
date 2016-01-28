/**
 * @file gulp file
 * @author leon(ludafa@outlook.com)
 */

const gulp = require('gulp');
const babel = require('./tools/gulp-babel.js');

gulp.task('js', function () {

    return gulp.src(['src/**/*.js'])
        .pipe(babel({
            modules: 'commonStrict',
            compact: false,
            ast: false,
            blacklist: ['strict'],
            externalHelpers: true,
            loose: 'all'
        }))
        .on('error', function (error) {
            console.error(error);
            this.emit('end');
        })
        .pipe(gulp.dest('lib'));

});

gulp.task('json', function () {
    return gulp.src(['src/**/*.json']).pipe(gulp.dest('lib'));
});

gulp.task('default', ['js', 'json']);

gulp.task('watch', function () {
    gulp.watch('src/**/*.js', ['default']);
});
