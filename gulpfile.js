/* jshint node: true */

var util = require('util');
var path = require('path');
var os = require('os');

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
    var tools = {};
    var regex = /^vs([0-9]{3})comntools$/i;
    
//    var comtools = process.env.VS140COMNTOOLS;
//    var comtools = process.env.VS120COMNTOOLS;
//    var comtools = process.env.VS100COMNTOOLS;
    
    Object.keys(process.env).forEach(function(key) {
        if (regex.test(key)) {
            var match = key.match(regex);
            var version = match[1];
            
            tools[version] = {
                version: version,
                envvar: key,
                path: process.env[key]
            };
        }
    });
    
    var versions = Object.keys(tools).sort(function (a, b) {
        return +b - +a;
    });
    
    if (!versions.length) {
        throw new Error('did not find any common tools');
    }
    
    var ver = versions[0];
    var opts = {
        varsscript: path.join(tools[ver].path, 'vsvars32.bat')
    };
    
    async.series([
        function makeBin(next) {
            mkdirp('bin', next);
        },
        function getPaths(next) {
            var task = util.format('"%s" && where cl', opts.varsscript);

            shellton.exec({
                task: task
            }, function(err, stdout, stderr) {
                if (err) {
                    return next(err);
                }

                if (stderr.trim()) {
                    return next(stderr);
                }

                if (stdout.trim().length === 0) {
                    return next('nothing in stdout');
                }

                var lines = stdout.split(os.EOL);

                if (!lines.length) {
                    return next('no lines found in stdout');
                }

                opts.cl = lines[0];

                next();
            });
        },
        function execBuild(next) {
            var SRC = path.join('native', 'open.c');
            var OUT = path.join('bin', 'open.exe');
            var OBJ = path.join('bin', 'open.obj');
    
            var task = util.format(
                '"%s" && "%s" "%s" /Fe:%s /Fo:%s',
                opts.varsscript,
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
