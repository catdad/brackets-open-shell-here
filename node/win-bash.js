/* jshint node: true */

var os = require('os');
var childProcess = require('child_process');
var spawn = childProcess.spawn;
var exec = childProcess.exec;

function find(bin, done) {
    exec('where ' + bin, function (err, stdout) {
        if (err) {
            return done(err);
        }

        if (stdout.length) {
            var lines = stdout.split(os.EOL);

            if (lines[0]) {
                return done(null, lines[0].trim());
            }
        }
        
        done(new Error('could not find bash'));
    });
}

function execBinary(bin, args, opts) {
    opts.stdio = ['ignore', process.stdout, process.stderr];
    var spawnArgs = ['/c', 'start', bin].concat(args);
    
    spawn('cmd', spawnArgs, opts);
}

module.exports = function (dirpath) {
    console.log('opening windows bash', dirpath);
    
    find('node', function (err, location) {
        if (err) {
            console.error(err);
            return;
        }
        
        dirpath = JSON.stringify(dirpath).replace(/"/g, '');
        
        var command = '"' + location + '" -e "require(\'./win-bash.js\').openBash(\'' + dirpath + '\')"';
        
        console.log('exec:', command);
        
        exec(command, {
           cwd: __dirname 
        }, function () {
            console.log('node exec is over', arguments);
        });
    });
};

module.exports.openBash = function(dirpath) {
    
    console.log('open bash at', dirpath);
    
    find('bash', function (err, location) {
        if (err) {
            console.error(err);
            return;
        }
        
        execBinary(location, [], {
            cwd: dirpath
        });
    });
};
