/* jslint node: true, esversion: 6 */

var spawn = require('child_process').spawn;

module.exports = function (type) {
    return function openShellWindows(dirpath, title) {

        // so... use powershell to run cmd as admin, and then use that cmd
        // to launch the requested shell in the correct directory
        var cmd = `powershell.exe -Command "Start-Process cmd \\"/c start /d %cd% ${type}\\" -Verb RunAs"`;

        // and now use cmd to run that bad boy
        spawn('cmd.exe', ['/c', cmd], {
            stdio: 'ignore',
            cwd: dirpath,
            windowsVerbatimArguments: true
        }).unref();
    };
};
