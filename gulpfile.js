/* jshint node: true */

var util = require('util');
var path = require('path');
var fs = require('fs');

var gulp = require('gulp');
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
//        function getPaths(next) {
//            var task = util.format('"%s" && where cl', opts.varsscript);
//
//            shellton.exec({
//                task: task
//            }, function(err, stdout, stderr) {
//                if (err) {
//                    return next(err);
//                }
//
//                if (stderr.trim()) {
//                    return next(stderr);
//                }
//
//                if (stdout.trim().length === 0) {
//                    return next('nothing in stdout');
//                }
//
//                var lines = stdout.split(os.EOL);
//
//                if (!lines.length) {
//                    return next('no lines found in stdout');
//                }
//
//                opts.cl = lines[0];
//
//                next();
//            });
//        },
        function execBuild(next) {
            var SRC = path.join('native', 'open.c');
            var OUT = path.join('bin', 'open.exe');
            var OBJ = path.join('bin', 'open.obj');
    
            var task = util.format(
                '"%s" && "%s" "%s" /Fe:%s /Fo:%s',
                opts.vcvars,
                opts.cl,
                SRC,
                OUT,
                OBJ
            );
            
            console.log('running:', task);
            
            shellton.exec({
                task: task,
                cwd: __dirname
            }, function(err, stdout, stderr) {
                console.log(stdout);
                console.log('--------------');
                console.log(stderr);
                
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
