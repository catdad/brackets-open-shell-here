/* jshint devel: true, esversion: 5 */
/* global define, $, document, brackets */

define(function (require, exports, module) {
    'use strict';

    var name = 'catdad.open-shell-here';

    var AppInit = brackets.getModule('utils/AppInit');
    var NodeDomain = brackets.getModule('utils/NodeDomain');
    var ExtensionUtils = brackets.getModule('utils/ExtensionUtils');
    var ProjectManager = brackets.getModule('project/ProjectManager');
    var PreferencesManager = brackets.getModule('preferences/PreferencesManager');
    var prefs = PreferencesManager.getExtensionPrefs(name);
    var lodash = brackets.getModule('thirdparty/lodash');

    var $toolbar;
    var supportedList = { default: true };
    var displayList = { default: true };

    var openShellDomain = new NodeDomain(
        'open-shell-here',
        ExtensionUtils.getModulePath(module, 'node/open-shell-domain')
    );

    // load the style for this extension
    ExtensionUtils.loadStyleSheet(module, 'style/icon.css');

    // really shitty version of Node's util.format
    // ... or at least the part I use most frequently
    function render(str) {
        var args = [].slice.call(arguments, 1);
        var idx = 0;

        return str.replace(/\%s/g, function (s) {
            var val = s;

            if (args[idx] !== undefined) {
                val = args[idx].toString();
            }

            idx += 1;

            return val;
        });
    }

    var log = (function(c) {
        function arr(args) {
            var argsArr = [].slice.call(args);
            var first = argsArr.shift();

            // Only the first string in a log call can contain
            // formatting information, so we cannot prepend a
            // string in the arguments and still format correctly.
            // So instead, we will add to the first string if
            // it exists.

            if (typeof first === 'string') {
                first = '[' + name + '] ' + first;
                argsArr.unshift(first);
            } else {
                argsArr.unshift('[' + name + ']', first);
            }

            return argsArr;
        }

        function write(func, args) {
            func.apply(null, arr(args));
        }

        return {
            info: function () {
                write(c.log.bind(c), arguments);
            },
            error: function () {
                write(c.error.bind(c), arguments);
            }
        };
    }(console));

    openShellDomain
        .exec('getSupported')
        .done(function (list) {
            supportedList = list;

            onPrefUpdate();
        })
        .fail(function (err) {
            log.error('failed to get supported shells list:', err);
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
                    log.info('%s shell successfully started, showing %s', type, entry.fullPath);
                })
                .fail(function (err) {
                    log.error('Error opening %s shell, showing %s:', type, entry.fullPath, err);
                });
        };
    }

    function $button(type) {
        return $(render('<a href="#" class="catdad-open-shell-icon catdad-open-shell-icon-%s"></a>', type));
    }

    function leftClick() {
        $toggles.toggleClass('catdad-open-shell-open');
    }

    var $toggles = $('<div id="catdad-open-shell-toggles" class="catdad-open-shell-toggles"></div>')
        .html('<div class="catdad-open-shell-toggles-container"></div>')
        .on('click', 'a', function() {
            // set the state only, the display will be updated
            // on the pref change
            setDisplayPref(
                $(this).attr('catdad-open-shell-for'),
                !$(this).hasClass('catdad-open-shell-active')
            );
        });

    function renderButtons(list) {
        if ($toolbar === undefined) {
            return;
        }

        $toolbar.children('.catdad-open-shell-icon').remove();

        var fragment = document.createDocumentFragment();

        lodash.forEach(list, function(display, key) {
            if (display !== true) {
                return;
            }

            $button(key)
                .attr('title', render('Open %s shell', key))
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

        lodash.forEach(supported, function(isSupported, key) {
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

        return lodash.isArray(pref) ? pref : ['default'];
    }

    function setDisplayPref(name, isDisplayed) {
        var displayedPrefs = getDisplayPref();

        if (isDisplayed) {
            displayedPrefs = lodash.uniq(displayedPrefs.concat(name));
        } else {
            displayedPrefs = lodash.pull(displayedPrefs, name);
        }

        // do not allow hiding all buttons
        if (displayedPrefs.length === 0) {
            displayedPrefs = ['default'];
        }

        prefs.set('displayList', displayedPrefs, {
            location: {
                scope: 'user'
            }
        });
    }

    function onPrefUpdate() {
        var displayedPrefs = getDisplayPref();

        // TODO detect if this list actually changed

        displayList = lodash.reduce(supportedList, function(memo, val, name) {
            memo[name] = lodash.includes(displayedPrefs, name);
            return memo;
        }, {});

        renderToggles(supportedList, displayList);
        renderButtons(displayList);
    }

    // wait for init before doing any DOM interactions, etc.
    AppInit.appReady(function() {
        $toolbar = $('#main-toolbar .buttons');

        $toolbar.append($toggles);

        // init the buttons
        onPrefUpdate();
    });

    // add a preference change listener
    prefs.on('change', onPrefUpdate);
});
