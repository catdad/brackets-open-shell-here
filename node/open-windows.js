/* jshint node: true */

var childProcess = require('child_process');
var spawn = childProcess.spawn;

var title = process.argv[2] || 'cmd';
title = '"' + title + '"';
    
var execArgs = [
    '/c',
    'start',
    title,
    'cmd.exe'
];

var child = spawn('cmd.exe', execArgs, {
    stdio: 'ignore',
    detached: true,
    windowsVerbatimArguments: true
});

child.unref();
