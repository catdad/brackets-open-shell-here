/* jslint node: true, esversion: 6 */

(function () {
    var path = require('path');

    var supported = require('./supported-shells.js');
    var win = require('./win.js');
    var linux = require('./linux.js');

    var os = (/^win/.test(process.platform) ? 'win' : 'linux');

    function openShellUnimplemented(/* dirpath */) {
        console.error('not implemented');
    }

    var shells = {
        'win-default': win('cmd'),
        'win-bash': win('bash'),
        'win-powershell': win('powershell'),
        // yes, I know this is Ubuntu... I might
        // need to do some more research for other
        // distros
        'linux-default': linux('gnode-terminal'),
        'linux-xfce4-terminal': linux('xfce4-terminal')
    };

    function openShell(dirpath, term = 'default') {
        var title = path.basename(dirpath);
        var shell = `${os}-${term}`;

        if (shells[shell]) {
            shells[shell](dirpath, title);
        } else {
            openShellUnimplemented(dirpath, title);
        }

        return true;
    }

    function init(domainManager) {
        var paramsArray = [{
            name: 'dirpath',
            type: 'string',
            description: 'the starting path'
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

        domainManager.registerCommand(
            'open-shell-here',
            'getSupported',
            supported,
            true, // this command is asynchronous in Node
            'Get list of supported shells on the current platform',
            [],
            [{
                name: 'supported',
                type: 'object',
                description: 'List of supported shells'
            }]
        );
    }

    module.exports = { init };
}());
