/* jslint node: true */

(function () {
    var fs = require('fs');
    var spawn = require('child_process').spawn;

    function cmdStartTerm(path, term) {
        var stdio = (function() {
            if (!/^win/.test(process.platform)) {
                return 'ignore';
            }

            // believe it or not, Windows does have a null device
            // that is not the nul file
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

        spawn('cmd.exe', ['/c', 'start', 'cmd', '/K', 'cd', '/d', path], {
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
