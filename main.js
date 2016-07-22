/* jslint devel: true */
/* global define, $, document, brackets, Mustache */

define(function (require, exports, module) {
    'use strict';

    var AppInit = brackets.getModule('utils/AppInit');
    var NodeDomain = brackets.getModule('utils/NodeDomain');
    var ExtensionUtils = brackets.getModule('utils/ExtensionUtils');
    var CommandManager = brackets.getModule('command/CommandManager');
    var Commands = brackets.getModule('command/Commands');
    var Menus = brackets.getModule('command/Menus');
    var ProjectManager = brackets.getModule('project/ProjectManager');
    var Dialogs = brackets.getModule('widgets/Dialogs');
    
    var COMMAND_ID = 'catdad-open-shell-here';

    var openShellDomain = new NodeDomain(
        'open-shell-here',
        ExtensionUtils.getModulePath(module, 'node/open-shell-domain')
    );

    function openShell() {

        var entry = ProjectManager.getProjectRoot();
        
        if (entry) {
            console.log('Entering in openInTerm, path: ' + entry.fullPath);
            
            openShellDomain
                .exec('start', entry.fullPath)
                .done(function () {
                    console.log('Term successfully started, showing : ' + entry.fullPath);
                })
                .fail(function (err) {
                    console.error('Error showing ' + entry.fullPath + ' in Term:', err);
                });
        }
    }

    CommandManager.register('Open shell', COMMAND_ID, openShell);

    var menu1 = Menus.getContextMenu(Menus.ContextMenuIds.PROJECT_MENU);
    menu1.addMenuItem(COMMAND_ID);

    /* Create Terminal Icon */
    ExtensionUtils.loadStyleSheet(module, 'styles/icon.css');
    $(document.createElement('a'))
        .attr('id', 'catdad-open-shell-here')
        .attr('href', '#')
        .attr('title', 'Open shell')
        .on('click', openShell)
        .appendTo($('#main-toolbar .buttons'));
});
