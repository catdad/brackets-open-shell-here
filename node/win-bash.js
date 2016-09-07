/* jshint node: true */

var spawn = require('child_process').spawn;
var exec = require('child_process').exec;
var os = require('os');

function find(done) {
    exec('where bash', function (err, stdout) {
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

function open(location, dirpath) {
    spawn('cmd', ['/c', 'start', location], {
        stdio: ['ignore', 'inherit', 'inherit'],
        cwd: dirpath
    });
}

module.exports = function (dirpath) {
    console.log('opening windows bash', dirpath);
    
    find(function (err, location) {
        if (err) {
            console.log('WINBASH ERROR');
            console.error(err);
            return;
        }
        
        open(location, dirpath);
    });
};
