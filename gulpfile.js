/* jshint node: true */

var util = require('util');
var path = require('path');
var fs = require('fs');

var gulp = require('gulp');
var gutil = require('gulp-util');
var async = require('async');
var mkdirp = require('mkdirp');
var del = require('del');
var zip = require('gulp-zip');
var sequence = require('gulp-sequence');
var shellton = require('shellton');

var pkg = require('./package.json');

var SOURCE = ['main.js', 'package.json', 'node/**', 'bin/*.exe', 'style/**'];
var DEST = 'output';

gulp.task('clean', function() {
    return del(DEST);
});

gulp.task('clean:bin', function() {
    return del('bin');
});

gulp.task('zip', function() {
    var filename = util.format('%s.zip', pkg.name);

    gulp.src(SOURCE, { base: path.resolve(__dirname) })
        .pipe(zip(filename))
        .pipe(gulp.dest(DEST));
});

gulp.task('compile', ['clean:bin'], function(done) {
    var regex = /microsoft visual studio ([0-9]+\.[0-9])+/i;
    var opts = {};

    async.series([
        function makeBin(next) {
            mkdirp('bin', next);
        },
        function getMsvs(next) {
            var programFiles = process.env['ProgramFiles(x86)'] || process.env.ProgramFiles;

            if (!programFiles) {
                return setImmediate(next, new Error('could not find ProgramFiles'));
            }

            fs.readdir(programFiles, function(err, list) {
                if (err) {
                    return next(err);
                }

                var msvsVersions = list.filter(function(item) {
                    return regex.test(item);
                }).map(function(item) {

                    var root = path.resolve(programFiles, item);

                    return {
                        path: root,
                        version: item.match(regex)[1],
                        vcvars: path.resolve(root, 'VC', 'vcvarsall.bat'),
                        cl: path.resolve(root, 'VC', 'bin', 'cl.exe')
                    };
                }).sort(function(a, b) {
                    return Number(b.version) - Number(a.version);
                });

                opts = msvsVersions[0];

                next();
            });
        },
        function execBuild(next) {
            var SRC = path.join('native', 'open.c');
            var OUT = path.join('bin', 'open.exe');
            var OBJ = path.join('bin', 'open.obj');

            var task = util.format(
                '"%s" x86 && "%s" "%s" /Fe:%s /Fo:%s',
                opts.vcvars,
                opts.cl,
                SRC,
                OUT,
                OBJ
            );

            gutil.log('running: \'%s\'', gutil.colors.cyan(task));

            shellton.exec({
                task: task,
                cwd: __dirname
            }, function(err, stdout, stderr) {

                console.log(gutil.colors.yellow(stdout.trim()));
                console.log('--------------');
                console.log(gutil.colors.red(stderr.trim()));

                next();
            });
        }
    ], function(err) {
        if (err) {
            return done(err);
        }

        done();
    });
});

gulp.task('default', sequence('clean', 'compile', 'zip'));
