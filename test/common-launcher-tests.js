/* jshint node: true, mocha: true, esversion: 6 */

var expect = require('chai').expect;
var mockery = require('mockery');

var SPAWN_PATH = './spawn.js';

function enableMock(onSpawn) {
    mockery.enable({
        warnOnReplace: false,
        warnOnUnregistered: false,
        useCleanCache: true
    });

    mockery.registerMock(SPAWN_PATH, onSpawn);
}

function disableMock() {
    mockery.deregisterAll();
    mockery.disable();
}

module.exports = (launcherPath) => {
    function launcher() {
        return require(launcherPath);
    }

    afterEach(() => disableMock());

    it('exports a function with one parameter', () => {
        expect(launcher()).to.be.a('function').and.to.have.lengthOf(1);
    });

    it('returns a function when called', () => {
        expect(launcher()('thing')).to.be.a('function');
    });

    it('calls spawn with the provided parameters', (done) => {
        enableMock(function (cmd, args, opts) {
            expect(cmd).to.be.a('string');

            if (Array.isArray(args)) {
                expect(args).to.be.an('array');
                expect(opts).to.be.an('object');
            } else {
                expect(args).to.be.an('object');
            }

            done();
        });

        launcher()('thing')(__dirname, 'title');
    });
};

module.exports.enableMock = enableMock;
module.exports.disableMock = disableMock;
