/* jslint node: true */

(function () {
    var fs = require('fs');
    var spawn = require('child_process').spawn;

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
    
    function shellArgs(path) {
        if (/^win/.test(process.platform)) {
            return ['/c', 'start', 'cmd', '/K', 'cd', '/d', path];
        } else {
            // TODO
            return [];
        }
    }
    
    function cmdStartTerm(path, term) {
        var stdio = (function() {
            if (!/^win/.test(process.platform)) {
                return 'ignore';
            }

            // Believe it or not, Windows does have a null device
            // that is not the nul file. We will use it here to
            // make sure the spawned process detaches correctly.
            var NULLDEV = '\\\\.\\NUL';
            var MODE = {
                READ: 'r',
                WRITE: 'w'
            };

            return [
                fs.openSync(NULLDEV, MODE.READ),
                fs.openSync(NULLDEV, MODE.WRITE),
                fs.openSync(NULLDEV, MODE.WRITE)
            ];
        }());
        
        var shell = defaultShell();

        spawn(shell, shellArgs(path), {
            detached: true,
            stdio: stdio
        }).unref();

        return true;
    }

    function init(domainManager) {
        var paramsArray = [
            { name: 'path', type: 'string', description: 'The starting path: the project folder path' },
            { name: 'term', type: 'string', description: 'alternate terminal' }
        ];

        if (!domainManager.hasDomain('open-shell-here')) {
            domainManager.registerDomain('open-shell-here', {
                major: 0,
                minor: 1
            });
        }
        
        domainManager.registerCommand(
            'open-shell-here', // domain name
            'start', // command name
            cmdStartTerm, // command handler function
            false, // this command is synchronous in Node
            'Open a shell in the project folder.',
            paramsArray, // parameters
            [] // return values
        );
    }

    exports.init = init;
}());
