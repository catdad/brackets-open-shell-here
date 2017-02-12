/* jslint node: true, esversion: 6 */

var spawn = require('child_process').spawn;

module.exports = function () {
    var proc = spawn.apply(null, arguments);

    proc.on('error', function (err) {
        console.log('shell launcher exited with error:', err);
    });

    proc.on('exit', function (code) {
        console.log('shell launcher exited with code:', code);
    });

    proc.unref();

    return proc;
};
