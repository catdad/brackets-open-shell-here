/* jshint node: true, mocha: true, esversion: 6 */

var expect = require('chai').expect;

var spawn = require('../node/spawn.js');

var platform = /^win/.test(process.platform) ? 'win' : 'linux';
var bin = platform === 'win' ? 'cmd.exe' : 'bash';
var arg = platform === 'win' ? '/c' : '-c';

describe('[spawn]', () => {
    it('spawns real processes', function (done) {
        var proc = spawn(bin, [arg, 'echo', 'pineapples']);

        proc.on('error', done);

        proc.on('exit', function (code) {
            expect(code).to.equal(0);

            done();
        });
    });

    it('adds an error handler to the process');

    it('adds an exit handler on the process');
});
