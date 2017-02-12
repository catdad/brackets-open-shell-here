/* jshint node: true, mocha: true, esversion: 6 */

var expect = require('chai').expect;

module.exports = (launcher) => {
    it('exports a function with one parameter', () => {
        expect(launcher).to.be.a('function').and.to.have.lengthOf(1);
    });

    it('returns a function when called', () => {
        expect(launcher('thing')).to.be.a('function');
    });
};
