/* jshint node: true, esversion: 6 */

var os = require('./os.js');
var exec = require('./child.js').exec;

var platform = (/^win/.test(process.platform)) ? 'win' : 'linux';

function ensureCallback(done) {
    return typeof done === 'function' ? done : function noop() {};
}

function callbackPromise(func, callback) {
    callback = ensureCallback(callback);

    return new Promise(function (resolve, reject) {
        func(function onDone(err) {
            if (err) {
                reject(err);
                callback(err);

                return;
            }

            var args = [].slice.call(arguments, 1);

            resolve.apply(null, args);
            callback.apply(null, [null].concat(args));
        });
    });
}

function find(bin, callback) {
    var cmd = (platform === 'win') ? 'where' : 'which';

    return callbackPromise(function (done) {
        exec(`${cmd} ${bin}`, function (err, stdout) {
            if (err) {
                return done(err);
            }

            if (stdout.length) {
                var lines = stdout.split(os.EOL);

                if (lines[0]) {
                    return done(null, lines[0].trim());
                }
            }

            done(new Error('could not find bash'));
        });
    }, callback);
}

function supported(bin, callback) {
    return callbackPromise(function (done) {
        find(bin, function (err) {
            done(null, {
                [bin === os.shell ? 'default' : bin]: err ? false : true
            });
        });
    }, callback);
}

function getSupportedShells(done) {
    Promise.all(os.list.map(supported)).then(function (val) {
        done(null, val.reduce(function (memo, obj) {
            return Object.assign(memo, obj);
        }, {}));
    }).catch(done);
}

module.exports = getSupportedShells;
module.exports.defaults = os;
