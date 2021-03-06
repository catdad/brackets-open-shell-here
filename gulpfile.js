/* jshint node: true, esversion: 6 */

var path = require('path');

var gulp = require('gulp');
var del = require('del');
var zip = require('gulp-zip');
var sequence = require('gulp-sequence');
var mocha = require('gulp-mocha');
var istanbul = require('gulp-istanbul');
var filter = require('gulp-filter');
var jshint = require('gulp-jshint');
var graceful = require('gulp-graceful-error');

var pkg = require('./package.json');

var source = (function () {
    var src = {};

    src.lib = ['main.js', 'package.json', 'node/**', 'style/**'];
    src.test = ['test/**/*.test.js'];
    src.all = [].concat(src.lib).concat(['test/**/*.js']);

    return src;
}());

var DEST = 'output';

gulp.task('clean', function () {
    return del(DEST);
});

gulp.task('zip', function () {
    var filename = `${pkg.name}-${pkg.version}.zip`;

    gulp.src(source.lib, { base: path.resolve(__dirname) })
        .pipe(zip(filename))
        .pipe(gulp.dest(DEST));
});

gulp.task('lint', function () {
    return gulp.src(source.all)
        .pipe(graceful())
        .pipe(filter(['**/*.js']))
        .pipe(jshint())
        .pipe(jshint.reporter('jshint-more-stylish'))
        .pipe(jshint.reporter('fail'))
        .graceful();
});

gulp.task('coverage-instrument', function () {
    return gulp.src(source.lib)
        .pipe(filter(['**/*.js']))
        .pipe(istanbul())
        .pipe(istanbul.hookRequire());
});

gulp.task('coverage-report', function () {
    return gulp.src(source.test)
        .pipe(istanbul.writeReports());
});

gulp.task('mocha', function () {
    return gulp.src(source.test)
        .pipe(graceful())
        .pipe(mocha())
        .graceful();
});

gulp.task('test', sequence('lint', 'coverage-instrument', 'mocha', 'coverage-report'));

gulp.task('build', sequence('clean', 'zip'));

gulp.task('default', ['build']);
