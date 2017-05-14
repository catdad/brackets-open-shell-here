/* jshint node: true, esversion: 6 */

var os = require('os');

var win = {
    name: 'win',
    shell: 'cmd',
    list: ['cmd', 'bash', 'powershell']
};

var darwin = {
    name: 'darwin',
    shell: 'Terminal',
    list: ['Terminal', 'iTerm']
};

var linux = {
    name: 'linux',
    shell: 'gnome-terminal',
    list: ['gnome-terminal', 'xfce4-terminal']
};

module.exports = (function (plt) {
    if (/^win/.test(plt)) {
        return win;
    }

    if (/^darwin/.test(plt)) {
        return darwin;
    }

    return linux;
}(process.platform));

module.exports.EOL = os.EOL;
module.exports.win = win;
module.exports.darwin = darwin;
module.exports.linux = linux;
