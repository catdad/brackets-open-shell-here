/* jshint node: true, esversion: 6 */

console.log('exec is required');

var { exec, spawn } = require('child_process');
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

function isArray(val) {
    return Array.isArray(val);
}

function isObject(val) {
    // not the best of object detection, but it will do
    return val instanceof Object && !isArray(val) && !isFunction(val);
}

function isFunction(val) {
    return typeof val === 'function';
}

function execCustom (command, opts, callback) {
    if (isFunction(opts)) {
        callback = opts;
        opts = {};
    }

    if (!isObject(opts)) {
        opts = {};
    }

    opts = extendOpts(opts);

    return exec(command, opts, callback);
}

function spawnCustom (command, args, opts) {
    if (isObject(args)) {
        opts = args;
        args = [];
    }

    if (!isObject(opts)) {
        opts = {};
    }

    opts = extendOpts(opts);

    return spawn(command, args, opts);
}

module.exports = {
    exec: execCustom,
    spawn: spawnCustom
};
