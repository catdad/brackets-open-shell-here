/* jslint devel: true */
/* global define, $, document, brackets, Mustache */

define(function (require, exports, module) {
    'use strict';

    var AppInit = brackets.getModule('utils/AppInit');
    var NodeDomain = brackets.getModule('utils/NodeDomain');
    var ExtensionUtils = brackets.getModule('utils/ExtensionUtils');
    var ProjectManager = brackets.getModule('project/ProjectManager');
    
    var openShellDomain = new NodeDomain(
        'open-shell-here',
        ExtensionUtils.getModulePath(module, 'node/open-shell-domain')
    );

    function openShell() {

        var entry = ProjectManager.getProjectRoot();
        
        if (entry) {
            console.log('Entering in openShell, path: ' + entry.fullPath);
            
            openShellDomain
                .exec('start', entry.fullPath)
                .done(function () {
                    console.log('Shell successfully started, showing : ' + entry.fullPath);
                })
                .fail(function (err) {
                    console.error('Error showing ' + entry.fullPath + ' in shell:', err);
                });
        }
    }

    /* Create Terminal Icon */
    ExtensionUtils.loadStyleSheet(module, 'style/icon.css');
    $(document.createElement('a'))
        .attr('id', 'catdad-open-shell-here')
        .attr('href', '#')
        .attr('title', 'Open shell')
        .on('click', openShell)
        .appendTo($('#main-toolbar .buttons'));
});
