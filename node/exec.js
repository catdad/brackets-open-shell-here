/* jshint node: true */

var exec = require('child_process').exec;
var path = require('path');

function extendOpts(opts) {
    if (!opts.env) {
        opts.env = {};
    }

    var PATH = process.env.PATH || process.env.Path || process.env.path;

    // this happens to detect both Windows and whether it is 64 bit Windows
    // so two birds with one if statement
    if ('ProgramFiles(x86)' in process.env) {
        opts.env.PATH = path.join(process.env.windir, 'Sysnative') + path.delimiter + PATH;
    }

    return opts;
}

module.exports = function (command, opts, callback) {
    if (typeof opts === 'function') {
        callback = opts;
        opts = {};
    }

    opts = extendOpts(opts);

    return exec(command, opts, callback);
};
