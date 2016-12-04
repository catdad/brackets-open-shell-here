/* jslint node: true, esversion: 6 */

var spawn = require('child_process').spawn;

module.exports = function openShellWindows(dirpath, title) {
    var ttl = `"${title}"`;

    spawn('cmd.exe', ['/c', 'start', ttl, 'bash'], {
        stdio: 'ignore',
        cwd: dirpath,
        windowsVerbatimArguments: true
    }).unref();
};
