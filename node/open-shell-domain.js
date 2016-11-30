/* jslint node: true */

(function () {
    var path = require('path');
    
    var winBash = require('./win-bash.js');
    var openWinShell = require('./win-brackets-1.8.js');

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
    
    function openShellWindowsBash(dirpath) {
        winBash(dirpath);
    }
    
    function openShellNix(/* dirpath */) {
        console.error('not implemented');
    }
    
    function openShell(dirpath, term) {
        var title = path.basename(dirpath);
        
        if (/^win/.test(process.platform)) {
            openWinShell(dirpath, title);
        } else {
            openShellNix(dirpath, title);
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
