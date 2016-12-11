/* jslint node: true, esversion: 6 */

var spawn = require('child_process').spawn;

module.exports = function (type) {
    return function openShellWindows(dirpath, title) {
        var ttl = `"${title}"`;

        spawn('cmd.exe', ['/c', 'start', ttl, type], {
            stdio: 'ignore',
            cwd: dirpath,
            windowsVerbatimArguments: true
        }).unref();
    };
};
