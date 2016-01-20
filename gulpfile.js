/**
 * @file gulp file
 * @author leon(ludafa@outlook.com)
 */

const gulp = require('gulp');
const babel = require('./tools/gulp-babel.js');

gulp.task('default', function () {

    return gulp.src(['src/**/*.js'])
        .pipe(babel({
            modules: 'commonStrict',
            compact: false,
            ast: false,
            blacklist: ['strict'],
            externalHelpers: true,
            loose: 'all'
        }))
        .pipe(gulp.dest('lib'));

});

gulp.task('watch', function () {
    gulp.watch('src/**/*.js', ['default']);
});
