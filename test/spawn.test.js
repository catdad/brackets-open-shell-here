/* jshint node: true, mocha: true, esversion: 6 */

var expect = require('chai').expect;
var mockIo = require('mock-stdio');

var spawn = require('../node/spawn.js');

var platform = /^win/.test(process.platform) ? 'win' : 'linux';
var bin = platform === 'win' ? 'cmd.exe' : 'bash';
var arg = platform === 'win' ? '/c' : '-c';

function getSpawn() {
    return spawn(bin, [arg, 'echo', 'pineapples']);
}

describe('[spawn]', () => {

    it('spawns real processes', function (done) {
        mockIo.start();

        var proc = getSpawn();

        proc.on('error', done);

        proc.on('exit', function (code) {
            var ioData = mockIo.end();

            expect(code).to.equal(0);

            expect(ioData.stdout).to.match(/shell launcher exited with code/);
            expect(ioData.stderr).to.have.lengthOf(0);

            done();
        });
    });

    it('adds an error handler to the process', function (done) {
        mockIo.start();

        var proc = getSpawn();

        expect(proc.listenerCount('error')).to.equal(1);

        proc.on('exit', () => {
            mockIo.end();

            done();
        });
        proc.on('error', done);
    });

    it('adds an exit handler on the process', function (done) {
        mockIo.start();

        var proc = getSpawn();

        expect(proc.listenerCount('exit')).to.equal(1);

        proc.on('exit', () => {
            mockIo.end();

            done();
        });
        proc.on('error', done);
    });

    it('logs if an error occurs', function (done) {
        mockIo.start();

        var binary = 'not-a-real-binary-i-hope';
        var proc = spawn(binary);

        proc.on('error', function (err) {
            var ioData = mockIo.end();

            expect(ioData.stdout).to.match(/shell launcher exited with error:/);
            expect(ioData.stdout).to.contain(err.message);

            expect(ioData.stderr).to.have.lengthOf(0);


            done();
        });
    });

});
