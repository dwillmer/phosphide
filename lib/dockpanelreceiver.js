/*-----------------------------------------------------------------------------
| Copyright (c) 2014-2015, PhosphorJS Contributors
|
| Distributed under the terms of the BSD 3-Clause License.
|
| The full license is in the file LICENSE, distributed with this software.
|----------------------------------------------------------------------------*/
'use strict';
var phosphor_widget_1 = require('phosphor-widget');
/**
 *
 */
var DockPanelReceiver = (function () {
    /**
     *
     */
    function DockPanelReceiver(dockPanel) {
        this._disposed = false;
        this._dockPanel = dockPanel;
        this._map = Object.create(null);
    }
    /**
     *
     */
    DockPanelReceiver.prototype.dispose = function () {
        if (this._disposed) {
            return;
        }
        this._disposed = true;
        for (var id in this._map) {
            this._map[id].parent = null;
        }
        this._dockPanel = null;
        this._map = null;
    };
    Object.defineProperty(DockPanelReceiver.prototype, "isDisposed", {
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
    DockPanelReceiver.prototype.add = function (ext) {
        if (this._disposed) {
            throw new Error('Receiver is disposed.');
        }
        if (ext.id in this._map) {
            return;
        }
        if (!(ext.item instanceof phosphor_widget_1.Widget)) {
            throw new Error("Extension " + ext.id + " contributed invalid item type.");
        }
        this._map[ext.id] = ext.item;
        this._dockPanel.insertTabAfter(ext.item); // TODO handle initial position
    };
    /**
     *
     */
    DockPanelReceiver.prototype.remove = function (id) {
        if (this._disposed) {
            throw new Error('Receiver is disposed.');
        }
        if (!(id in this._map)) {
            return;
        }
        var item = this._map[id];
        delete this._map[id];
        item.parent = null;
    };
    return DockPanelReceiver;
})();
exports.DockPanelReceiver = DockPanelReceiver;
