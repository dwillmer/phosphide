/*-----------------------------------------------------------------------------
| Copyright (c) 2014-2015, PhosphorJS Contributors
|
| Distributed under the terms of the BSD 3-Clause License.
|
| The full license is in the file LICENSE, distributed with this software.
|----------------------------------------------------------------------------*/
'use strict';
var phosphor_signaling_1 = require('phosphor-signaling');
var phosphor_widget_1 = require('phosphor-widget');
/**
 *
 */
var SideBarReceiver = (function () {
    /**
     *
     */
    function SideBarReceiver(bar, stack) {
        this._disposed = false;
        this._bar = bar;
        this._stack = stack;
        this._map = Object.create(null);
        bar.hidden = true;
        stack.hidden = true;
        stack.children.clear();
        bar.items = stack.children;
        bar.currentItemChanged.connect(this._onCurrentChanged, this);
        stack.children.changed.connect(this._onChildrenChanged, this);
    }
    /**
     *
     */
    SideBarReceiver.prototype.dispose = function () {
        if (this._disposed) {
            return;
        }
        this._disposed = true;
        phosphor_signaling_1.clearSignalData(this);
        this._stack.children.clear();
        this._stack.hidden = true;
        this._bar.hidden = true;
        this._stack = null;
        this._bar = null;
        this._map = null;
    };
    Object.defineProperty(SideBarReceiver.prototype, "isDisposed", {
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
    SideBarReceiver.prototype.add = function (ext) {
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
        this._stack.children.add(ext.item); // TODO handle sort order via config
    };
    /**
     *
     */
    SideBarReceiver.prototype.remove = function (id) {
        if (this._disposed) {
            throw new Error('Receiver is disposed.');
        }
        if (!(id in this._map)) {
            return;
        }
        var item = this._map[id];
        delete this._map[id];
        this._stack.children.remove(item);
    };
    /**
     *
     */
    SideBarReceiver.prototype._onCurrentChanged = function (sender, args) {
        this._stack.currentWidget = args.newValue;
        this._stack.hidden = !args.newValue;
    };
    /**
     *
     */
    SideBarReceiver.prototype._onChildrenChanged = function (sender) {
        if (sender.length === 0) {
            this._bar.hidden = true;
            this._stack.hidden = true;
        }
        else {
            this._bar.hidden = false;
        }
    };
    return SideBarReceiver;
})();
exports.SideBarReceiver = SideBarReceiver;
