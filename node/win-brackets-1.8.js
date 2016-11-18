/* jslint node: true */

var spawn = require('child_process').spawn;

module.exports = function openShellWindows(dirpath) {

    var proc = spawn('cmd.exe', ['/c', 'start', 'cmd.exe'], {
        stdio: ['ignore', 'pipe', 'pipe'],
        cwd: dirpath,
        windowsVerbatimArguments: true
    });

    // just for funsies, let's log this stuff
    proc.stdout.on('data', function(chunk) {
        console.log('stdout wrote:', chunk.toString());
    });

    proc.stderr.on('data', function(chunk) {
        console.error('stderr wrote:', chunk.toString());
    });
};
