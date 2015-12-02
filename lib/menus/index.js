/*-----------------------------------------------------------------------------
| Copyright (c) 2014-2015, PhosphorJS Contributors
|
| Distributed under the terms of the BSD 3-Clause License.
|
| The full license is in the file LICENSE, distributed with this software.
|----------------------------------------------------------------------------*/
'use strict';
var menusolver_1 = require('./menusolver');
var phosphor_disposable_1 = require('phosphor-disposable');
var phosphor_menus_1 = require('phosphor-menus');
var phosphor_widget_1 = require('phosphor-widget');
require('./index.css');
/**
 * Create menu receiver
 */
function createMenuReceiver() {
    console.log("Phosphide: create menu receiver");
    if (!('main' in menuMap)) {
        menuMap['main'] = new MenuExtensionPoint('main');
    }
    menuMap['main'].initialize(document.body);
    return menuMap['main'];
}
exports.createMenuReceiver = createMenuReceiver;
/**
 * Extension receiver for `menus:main`.
 */
// export
// function (extension: IExtension): IDisposable {
//   if (!('main' in menuMap)) {
//     menuMap['main'] = new MenuExtensionPoint('main');
//   }
//   let main = menuMap['main'];
//   return main.receive(extension);
// }
/**
 * Extension point initializer for `menus:main`.
 */
// export
// function initializeMain(): Promise<IDisposable> {
//   if (!('main' in menuMap)) {
//     menuMap['main'] = new MenuExtensionPoint('main');
//   }
//   let main = menuMap['main'];
//   return main.initialize(document.body);
// }
/**
 * Menu extension point handler.
 */
var MenuExtensionPoint = (function () {
    function MenuExtensionPoint(name) {
        this._commandItems = null;
        this._initialized = false;
        this._menu = null;
        this._name = '';
        this._name = name;
        this._commandItems = [];
        this._menu = new phosphor_menus_1.MenuBar();
    }
    /**
     * Receive an extension for this menu.
     */
    MenuExtensionPoint.prototype.add = function (extension) {
        var _this = this;
        var items = [];
        if (extension.item) {
            extension.item.forEach(function (item) {
                _this._commandItems.push(item);
                items.push(item);
            });
        }
        if (extension.data) {
            extension.data.items.forEach(function (item) {
                _this._commandItems.push(item);
            });
        }
        if (this._initialized) {
            this._menu.items = menusolver_1.solveMenu(this._commandItems);
        }
        if (!items)
            return void 0;
        return new phosphor_disposable_1.DisposableDelegate(function () {
            for (var _i = 0; _i < items.length; _i++) {
                var i = items[_i];
                _this._commandItems.splice(_this._commandItems.indexOf(i), 1);
            }
            _this._menu.items = menusolver_1.solveMenu(_this._commandItems);
            _this._menu.update();
        });
    };
    MenuExtensionPoint.prototype.remove = function (id) {
        // TODO
    };
    /**
     * Initialize the extension point.
     *
     * @param element - DOM Element to attach the menu.
     */
    MenuExtensionPoint.prototype.initialize = function (element) {
        this._initialized = true;
        this._menu.items = menusolver_1.solveMenu(this._commandItems);
        phosphor_widget_1.Widget.attach(this._menu, element);
        this._menu.update();
        return Promise.resolve(this);
    };
    Object.defineProperty(MenuExtensionPoint.prototype, "isDisposed", {
        /**
         * Return whether the extension point has been disposed.
         */
        get: function () {
            return (this._commandItems === null);
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Dispose of the resources held by the extension point.
     */
    MenuExtensionPoint.prototype.dispose = function () {
        this._commandItems = null;
        this._menu.dispose();
        delete menuMap[this._name];
    };
    return MenuExtensionPoint;
})();
// Menu extension point store.
var menuMap = {};
