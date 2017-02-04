/* jslint node: true, esversion: 6 */

var spawn = require('child_process').spawn;

module.exports = function (type) {
    return function openShellWindows(dirpath, title) {

        var cmd = `powershell.exe -Command "Start-Process cmd \\"/c start /d %cd% ${type}\\" -Verb RunAs"`;

        spawn('cmd.exe', ['/c', cmd], {
            stdio: 'ignore',
            cwd: dirpath,
            windowsVerbatimArguments: true
        }).unref();
    };
};
