/*-----------------------------------------------------------------------------
| Copyright (c) 2014-2015, PhosphorJS Contributors
|
| Distributed under the terms of the BSD 3-Clause License.
|
| The full license is in the file LICENSE, distributed with this software.
|----------------------------------------------------------------------------*/
'use strict';
var phosphor_widget_1 = require('phosphor-widget');
var mainpanel_1 = require('./mainpanel');
var dockpanelreceiver_1 = require('./dockpanelreceiver');
var menubarreceiver_1 = require('./menubarreceiver');
var sidebarreceiver_1 = require('./sidebarreceiver');
/**
 *
 */
function createMenuBarReceiver() {
    var main = ensureMainPanel();
    return new menubarreceiver_1.MenuBarReceiver(main.menuBar);
}
exports.createMenuBarReceiver = createMenuBarReceiver;
/**
 *
 */
function createMainReceiver() {
    var main = ensureMainPanel();
    return new dockpanelreceiver_1.DockPanelReceiver(main.dockPanel);
}
exports.createMainReceiver = createMainReceiver;
/**
 *
 */
function createLeftReceiver() {
    var main = ensureMainPanel();
    return new sidebarreceiver_1.SideBarReceiver(main.leftSideBar, main.leftStackedPanel);
}
exports.createLeftReceiver = createLeftReceiver;
/**
 *
 */
function createRightReceiver() {
    var main = ensureMainPanel();
    return new sidebarreceiver_1.SideBarReceiver(main.rightSideBar, main.rightStackedPanel);
}
exports.createRightReceiver = createRightReceiver;
/**
 *
 */
var ensureMainPanel = (function () {
    var main = null;
    return function () {
        if (main)
            return main;
        main = new mainpanel_1.MainPanel();
        // temporary ids untils we figure out how best to tag things.
        main.id = 'p-main-panel';
        main.leftSideBar.id = 'p-left-sidebar';
        main.rightSideBar.id = 'p-right-sidebar';
        main.leftStackedPanel.id = 'p-left-stack';
        main.rightStackedPanel.id = 'p-right-stack';
        main.splitPanel.id = 'p-main-split-panel';
        main.dockPanel.id = 'p-main-dock-panel';
        main.boxPanel.id = 'p-main-box-panel';
        // temporary classes until we figure out how best to tag things.
        main.leftSideBar.addClass('p-mod-left');
        main.rightSideBar.addClass('p-mod-right');
        phosphor_widget_1.Widget.attach(main, document.body);
        window.addEventListener('resize', function () { main.update(); });
        return main;
    };
})();
