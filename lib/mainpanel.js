/*-----------------------------------------------------------------------------
| Copyright (c) 2014-2015, PhosphorJS Contributors
|
| Distributed under the terms of the BSD 3-Clause License.
|
| The full license is in the file LICENSE, distributed with this software.
|----------------------------------------------------------------------------*/
'use strict';
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var phosphor_boxpanel_1 = require('phosphor-boxpanel');
var phosphor_dockpanel_1 = require('phosphor-dockpanel');
var phosphor_menus_1 = require('phosphor-menus');
var phosphor_splitpanel_1 = require('phosphor-splitpanel');
var phosphor_stackedpanel_1 = require('phosphor-stackedpanel');
var sidebar_1 = require('./sidebar');
/**
 *
 */
var MAIN_PANEL_CLASS = 'p-MainPanel';
/**
 *
 */
var MainPanel = (function (_super) {
    __extends(MainPanel, _super);
    /**
     *
     */
    function MainPanel() {
        _super.call(this);
        this.addClass(MAIN_PANEL_CLASS);
        this.direction = phosphor_boxpanel_1.Direction.TopToBottom;
        this.spacing = 0;
        this._menuBar = new phosphor_menus_1.MenuBar();
        this._boxPanel = new phosphor_boxpanel_1.BoxPanel();
        this._dockPanel = new phosphor_dockpanel_1.DockPanel();
        this._splitPanel = new phosphor_splitpanel_1.SplitPanel();
        this._leftSideBar = new sidebar_1.SideBar();
        this._rightSideBar = new sidebar_1.SideBar();
        this._leftStackedPanel = new phosphor_stackedpanel_1.StackedPanel();
        this._rightStackedPanel = new phosphor_stackedpanel_1.StackedPanel();
        this._menuBar.hidden = true;
        this._leftSideBar.hidden = true;
        this._rightSideBar.hidden = true;
        this._leftStackedPanel.hidden = true;
        this._rightStackedPanel.hidden = true;
        this._boxPanel.direction = phosphor_boxpanel_1.Direction.LeftToRight;
        this._boxPanel.spacing = 0;
        this._splitPanel = new phosphor_splitpanel_1.SplitPanel();
        this._splitPanel.orientation = phosphor_splitpanel_1.Orientation.Horizontal;
        this._splitPanel.spacing = 1;
        this._dockPanel.spacing = 6;
        phosphor_boxpanel_1.BoxPanel.setStretch(this._leftSideBar, 0);
        phosphor_boxpanel_1.BoxPanel.setStretch(this._rightSideBar, 0);
        phosphor_boxpanel_1.BoxPanel.setStretch(this._splitPanel, 1);
        phosphor_splitpanel_1.SplitPanel.setStretch(this._leftStackedPanel, 0);
        phosphor_splitpanel_1.SplitPanel.setStretch(this._rightStackedPanel, 0);
        phosphor_splitpanel_1.SplitPanel.setStretch(this._dockPanel, 1);
        this._splitPanel.children.add(this._leftStackedPanel);
        this._splitPanel.children.add(this._dockPanel);
        this._splitPanel.children.add(this._rightStackedPanel);
        this._boxPanel.children.add(this._leftSideBar);
        this._boxPanel.children.add(this._splitPanel);
        this._boxPanel.children.add(this._rightSideBar);
        this.children.add(this._menuBar);
        this.children.add(this._boxPanel);
    }
    /**
     *
     */
    MainPanel.prototype.dispose = function () {
        this._menuBar = null;
        this._boxPanel = null;
        this._dockPanel = null;
        this._splitPanel = null;
        this._leftSideBar = null;
        this._rightSideBar = null;
        this._leftStackedPanel = null;
        this._rightStackedPanel = null;
        _super.prototype.dispose.call(this);
    };
    Object.defineProperty(MainPanel.prototype, "menuBar", {
        /**
         *
         */
        get: function () {
            return this._menuBar;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MainPanel.prototype, "boxPanel", {
        /**
         *
         */
        get: function () {
            return this._boxPanel;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MainPanel.prototype, "dockPanel", {
        /**
         *
         */
        get: function () {
            return this._dockPanel;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MainPanel.prototype, "splitPanel", {
        /**
         *
         */
        get: function () {
            return this._splitPanel;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MainPanel.prototype, "leftSideBar", {
        /**
         *
         */
        get: function () {
            return this._leftSideBar;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MainPanel.prototype, "rightSideBar", {
        /**
         *
         */
        get: function () {
            return this._rightSideBar;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MainPanel.prototype, "leftStackedPanel", {
        /**
         *
         */
        get: function () {
            return this._leftStackedPanel;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MainPanel.prototype, "rightStackedPanel", {
        /**
         *
         */
        get: function () {
            return this._rightStackedPanel;
        },
        enumerable: true,
        configurable: true
    });
    return MainPanel;
})(phosphor_boxpanel_1.BoxPanel);
exports.MainPanel = MainPanel;
