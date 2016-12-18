/* jshint node: true */

var util = require('util');
var path = require('path');

var gulp = require('gulp');
var del = require('del');
var zip = require('gulp-zip');
var sequence = require('gulp-sequence');

var pkg = require('./package.json');

var SOURCE = ['main.js', 'package.json', 'node/**', 'style/**'];
var DEST = 'output';

gulp.task('clean', function() {
    return del(DEST);
});

gulp.task('zip', function() {
    var filename = util.format('%s.zip', pkg.name);

    gulp.src(SOURCE, { base: path.resolve(__dirname) })
        .pipe(zip(filename))
        .pipe(gulp.dest(DEST));
});

gulp.task('default', sequence('clean', 'zip'));
