/* jslint node: true, esversion: 6 */

var spawn = require('child_process').spawn;

module.exports = function (type) {
    return function openShellWindows(dirpath, title) {
        spawn(type, {
            stdio: 'ignore',
            cwd: dirpath
        }).unref();
    };
};
