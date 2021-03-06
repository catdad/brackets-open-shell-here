/* jslint node: true, esversion: 6 */

var spawn = require('./spawn.js');

module.exports = function (type) {
    return function openShell(dirpath /* , title */) {
        spawn('open', ['-a', type], {
            stdio: 'ignore',
            cwd: dirpath
        });
    };
};
