/* jshint node: true */

var os = require('os');
var exec = require('child_process').exec;

var pltform = (/^win/.test(process.platform)) ? 'win' : 'linux';

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

function winfind(bin, callback) {
    return callbackPromise(function (done) {
        exec('where ' + bin, function (err, stdout) {
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

function winsupported(bin, callback) {
    return callbackPromise(function (done) {
        winfind(bin, function (err) {
            var returnVal = {};
            returnVal[bin] = err ? false : true;
            
            done(null, returnVal);
        });
    }, callback);
}

function getSupportedShells(done) {
    if (pltform !== 'win') {
        return setImmediate(done, null, {});
    }
    
    Promise.all([
        winsupported('cmd'),
        winsupported('bash'),
        winsupported('powershell')
    ]).then(function (val) {
        done(null, val.reduce(function (memo, obj) {
            return Object.assign(memo, obj);
        }, {}));
    }).catch(done);
}

module.exports = getSupportedShells;
