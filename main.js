/* jslint devel: true, esversion: 6 */
/* global define, $, _, document, brackets */

define(function (require, exports, module) {
    'use strict';

    var name = 'catdad.open-shell-here';
    
    var AppInit = brackets.getModule('utils/AppInit');
    var NodeDomain = brackets.getModule('utils/NodeDomain');
    var ExtensionUtils = brackets.getModule('utils/ExtensionUtils');
    var ProjectManager = brackets.getModule('project/ProjectManager');
    var PreferencesManager = brackets.getModule('preferences/PreferencesManager');
    var prefs = PreferencesManager.getExtensionPrefs(name);
    
    var openShellDomain = new NodeDomain(
        'open-shell-here',
        ExtensionUtils.getModulePath(module, 'node/open-shell-domain')
    );
    
    openShellDomain
        .exec('getSupported')
        .done(function () {
            console.log('supoprted list', arguments);
        })
        .fail(function (err) {
            console.log('supported failed', err);
        });
    
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
        $toggles.toggleClass('catdad-open-shell-open');
    }
    
    var template = `
        <div class="catdad-open-shell-toggles-container">
            <a href="#" class="catdad-open-shell-icon"></a>
            <a href="#" class="catdad-open-shell-icon catdad-open-shell-icon-orange"></a>
        </div>
    `;

    var $toggles = $(document.createElement('div'))
        .attr('id', 'catdad-open-shell-toggles')
        .attr('class', 'catdad-open-shell-toggles')
        .html(template)
        .on('click', 'a', function() {
            $(this).toggleClass('catdad-open-shell-active');
        });
    
    // load the style for this extension
    ExtensionUtils.loadStyleSheet(module, 'style/icon.css');
    
    function renderButtons($toolbar, list) {
        $toolbar.children('.catdad-open-shell-icon').remove();
        
        var fragment = document.createDocumentFragment();
        
        _.forEach(list, function(display, key) {
            if (display !== true) {
                return;
            }
            
            $(`<a hred="#" class="catdad-open-shell-icon catdad-open-shell-${key}"></a>`)
                .on('click', openShell(key))
                .on('contextmenu', leftClick)
                .appendTo(fragment);
        });
        
        $(fragment).insertBefore($toggles);
    }
    
    AppInit.appReady(function() {
        var $toolbar = $('#main-toolbar .buttons');
        
        $toolbar.append($toggles);
        
        renderButtons($toolbar, {
            main: true
        });
    });
});
