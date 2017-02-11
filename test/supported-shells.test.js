/* jshint node: true, mocha: true, esversion: 6 */

var expect = require('chai').expect;

var supported = require('../node/supported-shells.js');

describe('[supported-shells]', () => {
    it('exports a function', () => {
        expect(supported).to.be.a('function');
    });

    it('asynchronously provides an array of supported shells', done => {
        supported((err, list) => {
            if (err) {
                return done(err);
            }

            expect(list).to.be.an('object');

            done();
        });
    });
});
