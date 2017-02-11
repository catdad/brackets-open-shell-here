/* jshint node: true, mocha: true, esversion: 6 */

var expect = require('chai').expect;

var domain = require('../node/open-shell-domain.js');

describe('[open-shell-domain]', () => {
    it('exports an object with an init method', () => {
        expect(domain).to.be.an('object')
            .and.to.have.property('init')
            .and.to.be.a('function');
    });
});
