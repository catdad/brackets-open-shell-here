/* jshint node: true */

var util = require('util');
var path = require('path');

var pkg = require('./package.json');

var gulp = require('gulp');
var del = require('del');
var zip = require('gulp-zip');

var SOURCE = ['main.js', 'node/**', 'bin/**', 'style/**'];
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
