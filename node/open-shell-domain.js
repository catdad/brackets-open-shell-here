/* jslint node: true */

(function () {
    var path = require('path');
    var spawn = require('child_process').spawn;
    
    var winBash = require('./win-bash.js');

    function defaultShell() {
        // code in this function adapted from Sindre Sorhus
        // MIT License
        // https://github.com/sindresorhus/default-shell/blob/d3e441382f0b95515dd208ca228ace817a3535a2/index.js
        var env = process.env;

        if (process.platform === 'darwin') {
            return env.SHELL || '/bin/bash';
        }

        if (process.platform === 'win32') {
            return env.COMSPEC || 'cmd.exe';
        }

        return env.SHELL || '/bin/sh';
    }
    
    function openShellWindowsBath(dirpath) {
        winBash(dirpath);
    }
    
    function openShellWindows(dirpath) {
        // Using spawn to launch cmd directly can sometimes
        // be hard to detach, causing the cmd window to close
        // when Brackets is closed. That can be worked around,
        // however, that causes stdin to be ignored. This means
        // that if I start a watch task (like "mocha --watch"),
        // I cannot use ^C to exit, and effectively, I have to 
        // close the cmd window in order to get out.
        // So... C to the rescue.

        var bin = path.resolve(__dirname, '../bin', 'open.exe');
        
        var proc = spawn(bin, [
            '"' + path.basename(dirpath) + '"'
        ], {
            stdio: ['ignore', 'pipe', 'pipe'],
            cwd: dirpath,
            windowsVerbatimArguments: true
        });
        
        // just for funsies, let's log this stuff
        proc.stdout.on('data', function(chunk) {
            console.log('stdout wrote:', chunk.toString());
        });
        
        proc.stderr.on('data', function(chunk) {
            console.error('stderr wrote:', chunk.toString());
        });
    }
    
    function openShellNix(/* dirpath */) {
        console.error('not implemented');
    }
    
    function openShell(dirpath, term) {
        
        if (/^win/.test(process.platform)) {
            openShellWindows(dirpath);
        } else {
            openShellNix(dirpath);
        }
        
        return true;
    }
    
    function init(domainManager) {
        var paramsArray = [{
            name: 'dirpath',
            type: 'string',
            description: 'The starting path: the project folder path'
        }, {
            name: 'term',
            type: 'string',
            description: 'alternate terminal'
        }];

        if (!domainManager.hasDomain('open-shell-here')) {
            domainManager.registerDomain('open-shell-here', {
                major: 0,
                minor: 1
            });
        }
        
        domainManager.registerCommand(
            'open-shell-here', // domain name
            'start', // command name
            openShell, // command handler function
            false, // this command is synchronous in Node
            'Open a shell in the project folder.',
            paramsArray, // parameters
            [] // return values
        );
    }

    exports.init = init;
}());
