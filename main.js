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

    var $toolbar;
    var supportedList = {};
    var displayList = {
        default: true
    };

    var openShellDomain = new NodeDomain(
        'open-shell-here',
        ExtensionUtils.getModulePath(module, 'node/open-shell-domain')
    );

    openShellDomain
        .exec('getSupported')
        .done(function (list) {
            supportedList = list;

            renderToggles(supportedList, displayList);
        })
        .fail(function (err) {
            console.error(`[${name}] failed to get supported shells list:`, err);
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

    function $button(type) {
        return $(`<a href="#" class="catdad-open-shell-icon catdad-open-shell-icon-${type}"></a>`);
    }

    function leftClick() {
        $toggles.toggleClass('catdad-open-shell-open');
    }

    var $toggles = $(document.createElement('div'))
        .attr('id', 'catdad-open-shell-toggles')
        .attr('class', 'catdad-open-shell-toggles')
        .html(`<div class="catdad-open-shell-toggles-container"></div>`)
        .on('click', 'a', function() {
            // set the state only, the display will be updated
            // on the pref change
            setDisplayPref(
                $(this).attr('catdad-open-shell-for'),
                !$(this).hasClass('catdad-open-shell-active')
            );
        });

    // load the style for this extension
    ExtensionUtils.loadStyleSheet(module, 'style/icon.css');

    function renderButtons(list) {
        if ($toolbar === undefined) {
            return;
        }

        $toolbar.children('.catdad-open-shell-icon').remove();

        var fragment = document.createDocumentFragment();

        _.forEach(list, function(display, key) {
            if (display !== true) {
                return;
            }

            $button(key)
                .on('click', openShell(key))
                .on('contextmenu', leftClick)
                .appendTo(fragment);
        });

        $(fragment).insertBefore($toggles);
    }

    function renderToggles(supported, enabled) {
        if ($toolbar === undefined) {
            return;
        }

        var fragment = document.createDocumentFragment();

        _.forEach(supported, function(isSupported, key) {
            if (!isSupported) {
                return;
            }

            $button(key)
                .addClass(enabled[key] ? 'catdad-open-shell-active' : '')
                .attr('catdad-open-shell-for', key)
                .appendTo(fragment);
        });

        $toggles.children().first().empty().append(fragment);
    }

    function getDisplayPref() {
        var pref = prefs.get('displayList');

        if (!_.isArray(pref)) {
            return ['default'];
        }

        return pref;
    }

    function setDisplayPref(name, isDisplayed) {
        var displayedPrefs = getDisplayPref();

        if (isDisplayed) {
            displayedPrefs = _.uniq(displayedPrefs.concat(name));
        } else {
            displayedPrefs = _.pull(displayedPrefs, name);
        }

        prefs.set('displayList', displayedPrefs);
    }

    function onPrefUpdate() {
        var displayedPrefs = getDisplayPref();

        // TODO detect if this list actually changed

        displayList = _.reduce(supportedList, function(memo, val, name) {
            memo[name] = _.includes(displayedPrefs, name);
            return memo;
        }, {});

        renderToggles(supportedList, displayList);
    }

    // wait for init before doing any DOM interactions, etc.
    AppInit.appReady(function() {
        $toolbar = $('#main-toolbar .buttons');

        $toolbar.append($toggles);

        renderToggles(supportedList, displayList);

        renderButtons({
            default: true
        });
    });

    // add a preference change listener
    prefs.on('change', onPrefUpdate);
});
