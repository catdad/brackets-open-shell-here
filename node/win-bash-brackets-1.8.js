/* jslint node: true */

var util = require('util');
var spawn = require('child_process').spawn;

module.exports = function openShellWindows(dirpath, title) {
    var ttl = util.format('"%s"', title);

    spawn('cmd.exe', ['/c', 'start', ttl, 'bash'], {
        stdio: 'ignore',
        cwd: dirpath,
        windowsVerbatimArguments: true
    }).unref();
};
