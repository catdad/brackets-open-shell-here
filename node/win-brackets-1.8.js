/* jslint node: true */

var path = require('path');
var util = require('util');
var spawn = require('child_process').spawn;

module.exports = function openShellWindows(dirpath) {
    var title = util.format('"%s"', path.basename(dirpath));

    spawn('cmd.exe', ['/c', 'start', title, 'cmd.exe'], {
        stdio: 'ignore',
        cwd: dirpath,
        windowsVerbatimArguments: true
    }).unref();
};
