/* jshint node: true */

var spawn = require('child_process').spawn;

var child = spawn('cmd.exe', [
    '/c',
    'start',
    'cmd.exe'
], {
    stdio: 'ignore',
    detached: true
});

child.unref();
