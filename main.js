/* jslint devel: true */
/* global define, $, document, brackets */

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

    function openShell(type) {
        return function() {
            var entry = ProjectManager.getProjectRoot();

            if (!entry) {
                return;
            }

            openShellDomain
                .exec('start', entry.fullPath, type)
                .done(function () {
                    console.log('Shell successfully started, showing : ' + entry.fullPath);
                })
                .fail(function (err) {
                    console.error('Error showing ' + entry.fullPath + ' in shell:', err);
                });  
        };
    }
    
    function leftClick() {
        $toggles.toggleClass('catdad-open');
    }
    
    var $main = $(document.createElement('a'))
        .attr('id', 'catdad-open-shell-default')
        .attr('href', '#')
        .attr('title', 'Open shell\nright-click to configure')
        .on('click', openShell('default'))
        .on('contextmenu', leftClick);

    var $toggles = $(document.createElement('div'))
        .attr('id', 'catdad-open-shell-toggles')
        .html('TODO add options here');
    
    // load the style for this extension
    ExtensionUtils.loadStyleSheet(module, 'style/icon.css');
    
    AppInit.appReady(function() {
        var $toolbar = $('#main-toolbar .buttons');
        
        $toolbar.append($main);
//        $toolbar.append($toggles);
    });
    
});
