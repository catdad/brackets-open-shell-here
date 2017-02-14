/* jshint node: true, mocha: true, esversion: 6 */

var expect = require('chai').expect;

var spawn = require('../node/spawn.js');

var platform = /^win/.test(process.platform) ? 'win' : 'linux';
var bin = platform === 'win' ? 'cmd.exe' : 'bash';
var arg = platform === 'win' ? '/c' : '-c';

function getSpawn() {
    return spawn(bin, [arg, 'echo', 'pineapples']);
}

// allow hijacking IO, so that we can both
// test values and not log during a test
var fakeIo = (function () {

    var originalStdout = process.stdout.write;
    var originalStderr = process.stderr.write;

    var outData = [];
    var errData = [];

    function collect(arr) {
        return function (val) {
            arr.push(new Buffer(val));
        };
    }

    return {
        activate: function () {
            process.stdout.write = collect(outData);
            process.stderr.write = collect(errData);
        },
        deactivate: function () {
            process.stdout.write = originalStdout;
            process.stderr.write = originalStderr;

            var data = {
                stdout: Buffer.concat(outData).toString(),
                stderr: Buffer.concat(errData).toString()
            };

            outData = [];
            errData = [];

            return data;
        }
    };
})();

describe('[spawn]', () => {

    it('spawns real processes', function (done) {
        fakeIo.activate();

        var proc = getSpawn();

        proc.on('error', done);

        proc.on('exit', function (code) {
            var ioData = fakeIo.deactivate();

            expect(code).to.equal(0);

            expect(ioData.stdout).to.match(/shell launcher exited with code/);
            expect(ioData.stderr).to.have.lengthOf(0);

            done();
        });
    });

    it('adds an error handler to the process', function (done) {
        fakeIo.activate();

        var proc = getSpawn();

        expect(proc.listenerCount('error')).to.equal(1);

        proc.on('exit', () => {
            fakeIo.deactivate();

            done();
        });
        proc.on('error', done);
    });

    it('adds an exit handler on the process', function (done) {
        fakeIo.activate();

        var proc = getSpawn();

        expect(proc.listenerCount('exit')).to.equal(1);

        proc.on('exit', () => {
            fakeIo.deactivate();

            done();
        });
        proc.on('error', done);
    });

    it('logs if an error occurs', function (done) {
        fakeIo.activate();

        var binary = 'not-a-real-binary-i-hope';
        var proc = spawn(binary);

        proc.on('error', function (err) {
            var ioData = fakeIo.deactivate();

            expect(ioData.stdout).to.match(/shell launcher exited with error:/);
            expect(ioData.stdout).to.contain(err.message);

            expect(ioData.stderr).to.have.lengthOf(0);


            done();
        });
    });

});
