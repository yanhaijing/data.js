/**
 * @file gulp file
 * @author yanhaijing.com
 * @date 2016年1月13日 15:55:16
 */

var gulp = require('gulp');
var jshint = require('gulp-jshint');

gulp.task('lint', function() {
    return gulp.src('data.js')
        .pipe(jshint('.jshintrc'))
        .pipe(jshint.reporter('default'));
});
