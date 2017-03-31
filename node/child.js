/* jshint node: true, esversion: 6 */

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
        // So... on a 32-bit system, System32 has regular 32-bit apps, so everything just work.
        // This is old news. On a 64-bit system, System32 is actually an alias for all the
        // 64-bit apps, so that all the old legacy stuff using System32 gets the new 64-bit
        // apps. However, if 32-bit apps that use System32 try to do things, System32 is an
        // alias for 32-bit apps, even on 64-bit system. This is apparently okay, but I don't
        // like it. It also means that 32-bit apps on a 64-bit system don't have access to
        // some things that no one bothered to alias... because why bother support everything.
        // This is a problem when Brakcets keeps switching between bundling a 32-bit and 64-bit
        // node binary, meaning I can't guess what is going to be available from release to
        // release. Boo! Anyway, Sysnative will always hold the 64-bit apps on a 64-bit system.
        // In the freak case that we somehow got into this if statement and Sysnative does not
        // exist (like if someone is lying to us), we don't to force use this alias. Instead,
        // we will innocently add it at the start of the path, so that Windows itself will
        // use it to resolve commands before using System32 with all its aliases.
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
