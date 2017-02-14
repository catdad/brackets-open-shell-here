/* jshint node: true, mocha: true, esversion: 6 */

var path = require('path');

var expect = require('chai').expect;

var tools = require('./common-launcher-tests.js');

var domain = require.resolve('../node/open-shell-domain.js');

var os = (/^win/.test(process.platform) ? 'win' : 'linux');

function getDomain() {
    return require(domain);
}

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

    getDomain().init(manager);

    return manager._getCommands();
}

function getCommand(name) {
    var commands = getCommands();

    return commands[name];
}

describe('[open-shell-domain]', () => {
    it('exports an object with an init method', () => {
        expect(getDomain()).to.be.an('object')
            .and.to.have.property('init')
            .and.to.be.a('function');
    });

    describe('#init', () => {
        it('registers 2 commands', () => {
            var commands = getCommands();

            expect(Object.keys(commands)).to.deep.equal(['start', 'getSupported']);
        });
    });

    describe('"start" command', function () {
        var COMMAND = 'start';
        var PATH = path.resolve('.');

        var shells = ['default'].concat(
            os === 'win' ?
            ['bash', 'powershell'] :
            ['xfce4-terminal']
        );

        shells.forEach(function (name) {
            it(`can open ${name}`, function (done) {
                tools.enableMock(function () {
                    // all we really care about is that this is called

                    expect(arguments).to.have.length.above(0);

                    tools.disableMock();

                    done();
                });

                var command = getCommand(COMMAND);

                command.func(PATH, name);
            });
        });
    });
});
