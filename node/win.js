/* jslint node: true, esversion: 6 */

var spawn = require('./spawn.js');

module.exports = function (type) {
    return function openShellWindows(dirpath, title) {
        spawn('cmd.exe', ['/c', 'start', `"${title}"`, type], {
            stdio: 'ignore',
            cwd: dirpath,
            windowsVerbatimArguments: true
        });
    };
};
