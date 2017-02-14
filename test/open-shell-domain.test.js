/* jshint node: true, mocha: true, esversion: 6 */

var expect = require('chai').expect;

var tools = require('./common-launcher-tests.js');

var domain = require('../node/open-shell-domain.js');

function fakeManager() {
    var commands = {};

    return {
        hasDomain: () => true,
        registerCommand: (extension, name, func, isAsync, description, parameters, returns) => {
            commands[name] = { extension, name, func, isAsync, description, parameters, returns };
        },
        _getCommands: () => commands
    };
}

function getCommands() {
    var manager = fakeManager();

    domain.init(manager);

    return manager._getCommands();
}

function getCommand(name) {
    var commands = getCommands();

    return commands[name];
}

describe('[open-shell-domain]', () => {
    it('exports an object with an init method', () => {
        expect(domain).to.be.an('object')
            .and.to.have.property('init')
            .and.to.be.a('function');
    });

    describe('#init', () => {
        it('registers 2 commands', () => {
            var manager = fakeManager();

            domain.init(manager);

            var commands = manager._getCommands();

            expect(Object.keys(commands)).to.deep.equal(['start', 'getSupported']);
        });
    });

    describe('"openShell" command', function () {
        var COMMAND = 'openShell';

        var shells = [
            'win-default',
            'win-bash',
            'win-powershell',
            'linux-default',
            'linux-xfce4-terminal'
        ];

        shells.forEach(function (name) {
            it(`can open ${name}`);
        });
    });
});
