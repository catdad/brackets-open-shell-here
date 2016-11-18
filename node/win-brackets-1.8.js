/* jslint node: true */

var spawn = require('child_process').spawn;

module.exports = function openShellWindows(dirpath) {

    spawn('cmd.exe', ['/c', 'start', 'cmd.exe'], {
        stdio: 'ignore',
        cwd: dirpath,
        windowsVerbatimArguments: true
    }).unref();
};
