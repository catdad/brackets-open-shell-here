/* jshint node: true, mocha: true, esversion: 6 */

var commonLauncherTests = require('./common-launcher-tests.js');

var launcher = require('../node/win-admin.js');

describe('[win-admin]', () => {
    commonLauncherTests(launcher);
});
