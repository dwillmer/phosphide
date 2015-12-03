/*-----------------------------------------------------------------------------
| Copyright (c) 2014-2015, PhosphorJS Contributors
|
| Distributed under the terms of the BSD 3-Clause License.
|
| The full license is in the file LICENSE, distributed with this software.
|----------------------------------------------------------------------------*/
'use strict';
/**
 *
 */
var MenuBarReceiver = (function () {
    /**
     *
     */
    function MenuBarReceiver(menuBar) {
        this._disposed = false;
        this._menuBar = menuBar;
        this._map = Object.create(null);
        menuBar.hidden = true;
        menuBar.items = [];
    }
    /**
     *
     */
    MenuBarReceiver.prototype.dispose = function () {
        if (this._disposed) {
            return;
        }
        this._disposed = true;
        this._menuBar.items = [];
        this._menuBar.hidden = true;
        this._menuBar = null;
        this._map = null;
    };
    Object.defineProperty(MenuBarReceiver.prototype, "isDisposed", {
        /**
         *
         */
        get: function () {
            return this._disposed;
        },
        enumerable: true,
        configurable: true
    });
    /**
     *
     */
    MenuBarReceiver.prototype.add = function (ext) {
        if (this._disposed) {
            throw new Error('Receiver is disposed.');
        }
        if (ext.id in this._map) {
            return;
        }
        // TODO parse/create/merge/sort/populate
    };
    /**
     *
     */
    MenuBarReceiver.prototype.remove = function (id) {
        if (this._disposed) {
            throw new Error('Receiver is disposed.');
        }
        if (!(id in this._map)) {
            return;
        }
        var item = this._map[id];
        delete this._map[id];
        item.dispose();
    };
    return MenuBarReceiver;
})();
exports.MenuBarReceiver = MenuBarReceiver;
