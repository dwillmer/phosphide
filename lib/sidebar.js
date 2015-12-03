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
var arrays = require('phosphor-arrays');
var phosphor_domutil_1 = require('phosphor-domutil');
var phosphor_nodewrapper_1 = require('phosphor-nodewrapper');
var phosphor_observablelist_1 = require('phosphor-observablelist');
var phosphor_properties_1 = require('phosphor-properties');
var phosphor_signaling_1 = require('phosphor-signaling');
var phosphor_widget_1 = require('phosphor-widget');
/**
 * The class name added to SideBar instances.
 */
var SIDE_BAR_CLASS = 'p-SideBar';
/**
 * The class name added to the side bar content node.
 */
var CONTENT_CLASS = 'p-SideBar-content';
/**
 * The class name added to SideBarButton instances.
 */
var BUTTON_CLASS = 'p-SideBarButton';
/**
 * The class name added to a button text node.
 */
var TEXT_CLASS = 'p-SideBarButton-text';
/**
 * The class name added to a button icon node.
 */
var ICON_CLASS = 'p-SideBarButton-icon';
/**
 * The class name added to the current side bar button.
 */
var CURRENT_CLASS = 'p-mod-current';
/**
 * A widget which displays its items as a list of exclusive buttons.
 */
var SideBar = (function (_super) {
    __extends(SideBar, _super);
    /**
     * Construct a new side bar.
     */
    function SideBar() {
        _super.call(this);
        this._buttons = [];
        this.addClass(SIDE_BAR_CLASS);
    }
    /**
     * Create the DOM node for a side bar.
     */
    SideBar.createNode = function () {
        var node = document.createElement('div');
        var content = document.createElement('ul');
        content.className = CONTENT_CLASS;
        node.appendChild(content);
        return node;
    };
    /**
     * Dispose of the resources held by the widget.
     */
    SideBar.prototype.dispose = function () {
        this._buttons.forEach(function (btn) { btn.dispose(); });
        this._buttons.length = 0;
        _super.prototype.dispose.call(this);
    };
    Object.defineProperty(SideBar.prototype, "currentItem", {
        /**
         * Get the currently selected side bar item.
         *
         * #### Notes
         * This is a pure delegate to the [[currentItemProperty]].
         */
        get: function () {
            return SideBar.currentItemProperty.get(this);
        },
        /**
         * Set the currently selected side bar item.
         *
         * #### Notes
         * This is a pure delegate to the [[currentItemProperty]].
         */
        set: function (value) {
            SideBar.currentItemProperty.set(this, value);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SideBar.prototype, "currentItemChanged", {
        /**
         * A signal emitted when the current side bar item is changed.
         *
         * #### Notes
         * This is the notify signal for the [[currentItemProperty]].
         */
        get: function () {
            return SideBar.currentItemProperty.notify.bind(this);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SideBar.prototype, "items", {
        /**
         * Get the list of side bar items for the side bar.
         *
         * #### Notes
         * This is a pure delegate to the [[itemsProperty]].
         */
        get: function () {
            return SideBar.itemsProperty.get(this);
        },
        /**
         * Set the list side bar items for the side bar.
         *
         * #### Notes
         * This is a pure delegate to the [[itemsProperty]].
         */
        set: function (value) {
            SideBar.itemsProperty.set(this, value);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SideBar.prototype, "contentNode", {
        /**
         * Get the side bar content node.
         *
         * #### Notes
         * This is the node which holds the side bar button nodes. Modifying
         * the content of this node indiscriminately can lead to undesired
         * behavior.
         */
        get: function () {
            return this.node.getElementsByClassName(CONTENT_CLASS)[0];
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Handle the DOM events for the side bar.
     *
     * @param event - The DOM event sent to the side bar.
     *
     * #### Notes
     * This method implements the DOM `EventListener` interface and is
     * called in response to events on the side bar's DOM node. It should
     * not be called directly by user code.
     */
    SideBar.prototype.handleEvent = function (event) {
        if (event.type === 'mousedown') {
            this._evtMouseDown(event);
        }
    };
    /**
     * A message handler invoked on an `'after-attach'` message.
     */
    SideBar.prototype.onAfterAttach = function (msg) {
        this.node.addEventListener('mousedown', this);
    };
    /**
     * A message handler invoked on a `'before-detach'` message.
     */
    SideBar.prototype.onBeforeDetach = function (msg) {
        this.node.removeEventListener('mousedown', this);
    };
    /**
     * Handle the `'mousedown'` event for the side bar.
     */
    SideBar.prototype._evtMouseDown = function (event) {
        // Do nothing if it's not a left mouse press.
        if (event.button !== 0) {
            return;
        }
        // Do nothing if the press is not on a button.
        var index = hitTestButtons(this._buttons, event.clientX, event.clientY);
        if (index < 0) {
            return;
        }
        // Pressing on a button stops the event propagation.
        event.preventDefault();
        event.stopPropagation();
        // Update or toggle the current item.
        var btn = this._buttons[index];
        if (btn.item !== this.currentItem) {
            this.currentItem = btn.item;
        }
        else {
            this.currentItem = null;
        }
    };
    /**
     * The coerce handler for the [[currentItemProperty]].
     */
    SideBar.prototype._coerceCurrentItem = function (item) {
        var list = this.items;
        return (item && list && list.contains(item)) ? item : null;
    };
    /**
     * The change handler for the [[currentItemProperty]].
     */
    SideBar.prototype._onCurrentItemChanged = function (oldItem, newItem) {
        var oldBtn = arrays.find(this._buttons, function (btn) { return btn.item === oldItem; });
        var newBtn = arrays.find(this._buttons, function (btn) { return btn.item === newItem; });
        if (oldBtn)
            oldBtn.removeClass(CURRENT_CLASS);
        if (newBtn)
            newBtn.addClass(CURRENT_CLASS);
    };
    /**
     * The change handler for the [[itemsProperty]].
     */
    SideBar.prototype._onItemsChanged = function (oldList, newList) {
        // Disconnect the old list and dispose the old buttons.
        if (oldList) {
            oldList.changed.disconnect(this._onItemsListChanged, this);
            var content = this.contentNode;
            while (this._buttons.length) {
                var btn = this._buttons.pop();
                content.removeChild(btn.node);
                btn.dispose();
            }
        }
        // Create the new buttons and connect the new list.
        if (newList) {
            var content = this.contentNode;
            for (var i = 0, n = newList.length; i < n; ++i) {
                var btn = new SideBarButton(newList.get(i));
                content.appendChild(btn.node);
                this._buttons.push(btn);
            }
            newList.changed.connect(this._onItemsListChanged, this);
        }
        // Reset the current item to null.
        this.currentItem = null;
    };
    /**
     * The change handler for the items list `changed` signal.
     */
    SideBar.prototype._onItemsListChanged = function (sender, args) {
        switch (args.type) {
            case phosphor_observablelist_1.ListChangeType.Add:
                this._onItemsListAdd(args);
                break;
            case phosphor_observablelist_1.ListChangeType.Move:
                this._onItemsListMove(args);
                break;
            case phosphor_observablelist_1.ListChangeType.Remove:
                this._onItemsListRemove(args);
                break;
            case phosphor_observablelist_1.ListChangeType.Replace:
                this._onItemsListReplace(args);
                break;
            case phosphor_observablelist_1.ListChangeType.Set:
                this._onItemsListSet(args);
                break;
        }
    };
    /**
     * The handler invoked on a items list change of type `Add`.
     */
    SideBar.prototype._onItemsListAdd = function (args) {
        // Create the button for the new side bar item.
        var btn = new SideBarButton(args.newValue);
        // Add the button to the same location in the internal array.
        arrays.insert(this._buttons, args.newIndex, btn);
        // Lookup the next sibling reference.
        var ref = this._buttons[args.newIndex + 1];
        // Add the button node to the DOM before its next sibling.
        this.contentNode.insertBefore(btn.node, ref && ref.node);
    };
    /**
     * The handler invoked on a items list change of type `Move`.
     */
    SideBar.prototype._onItemsListMove = function (args) {
        // Move the button in the internal array.
        arrays.move(this._buttons, args.oldIndex, args.newIndex);
        // Lookup the target button.
        var btn = this._buttons[args.newIndex];
        // Lookup the next sibling reference.
        var ref = this._buttons[args.newIndex + 1];
        // Move the button in the DOM before its next sibling.
        this.contentNode.insertBefore(btn.node, ref && ref.node);
    };
    /**
     * The handler invoked on an items list change of type `Remove`.
     */
    SideBar.prototype._onItemsListRemove = function (args) {
        // Remove the button from the internal array.
        var btn = arrays.removeAt(this._buttons, args.oldIndex);
        // Remove the button node from the DOM.
        this.contentNode.removeChild(btn.node);
        // Clear the current item if it was removed.
        if (this.currentItem === btn.item) {
            this.currentItem = null;
        }
        // Dispose of the old button.
        btn.dispose();
    };
    /**
     * The handler invoked on a items list change of type `Replace`.
     */
    SideBar.prototype._onItemsListReplace = function (args) {
        // Create the new buttons for the new side bar items.
        var newItems = args.newValue;
        var newBtns = newItems.map(function (item) { return new SideBarButton(item); });
        // Replace the buttons in the internal array.
        var oldItems = args.oldValue;
        var oldBtns = (_a = this._buttons).splice.apply(_a, [args.newIndex, oldItems.length].concat(newBtns));
        // Remove the old buttons from the DOM.
        var content = this.contentNode;
        oldBtns.forEach(function (btn) { content.removeChild(btn.node); });
        // Lookup the next sibiling reference.
        var ref = this._buttons[args.newIndex + newBtns.length];
        var refNode = ref && ref.node;
        // Add the new buttons to the DOM before the next sibling.
        newBtns.forEach(function (btn) { content.insertBefore(btn.node, refNode); });
        // Clear the current item if it was removed.
        if (oldItems.indexOf(this.currentItem) !== -1) {
            this.currentItem = null;
        }
        // Dispose of the old buttons.
        oldBtns.forEach(function (btn) { btn.dispose(); });
        var _a;
    };
    /**
     * The handler invoked on a items list change of type `Set`.
     */
    SideBar.prototype._onItemsListSet = function (args) {
        // If the item was not actually changed, there is nothing to do.
        if (args.oldValue === args.newValue) {
            return;
        }
        // Create the button for the new side bar item.
        var newBtn = new SideBarButton(args.newValue);
        // Swap the new button in the internal array.
        var oldBtn = this._buttons[args.newIndex];
        this._buttons[args.newIndex] = newBtn;
        // Swap the new button node in the DOM.
        this.contentNode.replaceChild(newBtn.node, oldBtn.node);
        // Clear the current item if it was removed.
        if (this.currentItem === oldBtn.item) {
            this.currentItem = null;
        }
        // Dispose of the old button.
        oldBtn.dispose();
    };
    /**
     * The property descriptor for the currently selected side bar item.
     *
     * **See also:** [[currentItem]]
     */
    SideBar.currentItemProperty = new phosphor_properties_1.Property({
        name: 'currentItem',
        value: null,
        coerce: function (owner, value) { return owner._coerceCurrentItem(value); },
        changed: function (owner, old, value) { owner._onCurrentItemChanged(old, value); },
        notify: new phosphor_signaling_1.Signal(),
    });
    /**
     * The property descriptor for the observable list of side bar items.
     *
     * **See also:** [[items]]
     */
    SideBar.itemsProperty = new phosphor_properties_1.Property({
        name: 'items',
        value: null,
        coerce: function (owner, value) { return value || null; },
        changed: function (owner, old, value) { owner._onItemsChanged(old, value); },
    });
    return SideBar;
})(phosphor_widget_1.Widget);
exports.SideBar = SideBar;
/**
 * An object which manages a button node for a side bar.
 */
var SideBarButton = (function (_super) {
    __extends(SideBarButton, _super);
    /**
     * Construct a new side bar button.
     *
     * @param item - The side bar item to associate with the button.
     */
    function SideBarButton(item) {
        _super.call(this);
        this.addClass(BUTTON_CLASS);
        this._item = item;
        var title = item.title;
        this.textNode.textContent = title.text;
        if (title.icon)
            exAddClass(this.iconNode, title.icon);
        if (title.className)
            exAddClass(this.node, title.className);
        title.changed.connect(this._onTitleChanged, this);
    }
    /**
     * Create the DOM node for a side bar button.
     */
    SideBarButton.createNode = function () {
        var node = document.createElement('li');
        var icon = document.createElement('span');
        var text = document.createElement('span');
        icon.className = ICON_CLASS;
        text.className = TEXT_CLASS;
        node.appendChild(icon);
        node.appendChild(text);
        return node;
    };
    /**
     * Dispose of the resources held by the button.
     */
    SideBarButton.prototype.dispose = function () {
        this._item = null;
        phosphor_signaling_1.clearSignalData(this);
    };
    Object.defineProperty(SideBarButton.prototype, "isDisposed", {
        /**
         * Test whether the button is disposed.
         */
        get: function () {
            return this._item === null;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SideBarButton.prototype, "iconNode", {
        /**
         * Get the icon node for the button.
         *
         * #### Notes
         * This is a read-only property.
         */
        get: function () {
            return this.node.childNodes[0];
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SideBarButton.prototype, "textNode", {
        /**
         * Get the text node for the button.
         *
         * #### Notes
         * This is a read-only property.
         */
        get: function () {
            return this.node.childNodes[1];
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SideBarButton.prototype, "item", {
        /**
         * Get the side bar item associated with the button.
         *
         * #### Notes
         * This is a read-only property.
         */
        get: function () {
            return this._item;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * The handler for the title `changed` signal.
     */
    SideBarButton.prototype._onTitleChanged = function (sender, args) {
        switch (args.name) {
            case 'text':
                this._onTitleTextChanged(args);
                break;
            case 'icon':
                this._onTitleIconChanged(args);
                break;
            case 'className':
                this._onTitleClassNameChanged(args);
                break;
        }
    };
    /**
     * A method invoked when the title text changes.
     */
    SideBarButton.prototype._onTitleTextChanged = function (args) {
        this.textNode.textContent = args.newValue;
    };
    /**
     * A method invoked when the title icon changes.
     */
    SideBarButton.prototype._onTitleIconChanged = function (args) {
        var node = this.iconNode;
        if (args.oldValue)
            exRemClass(node, args.oldValue);
        if (args.newValue)
            exAddClass(node, args.newValue);
    };
    /**
     * A method invoked when the title class name changes.
     */
    SideBarButton.prototype._onTitleClassNameChanged = function (args) {
        var node = this.node;
        if (args.oldValue)
            exRemClass(node, args.oldValue);
        if (args.newValue)
            exAddClass(node, args.newValue);
    };
    return SideBarButton;
})(phosphor_nodewrapper_1.NodeWrapper);
// TODO - move `exAddClass` and `exRemClass` to `phosphor-domutil`?
/**
 * Add a whitespace separated class name to the given node.
 */
function exAddClass(node, name) {
    var list = node.classList;
    var parts = name.split(/\s+/);
    for (var i = 0, n = parts.length; i < n; ++i) {
        if (parts[i])
            list.add(parts[i]);
    }
}
/**
 * Remove a whitespace separated class name to the given node.
 */
function exRemClass(node, name) {
    var list = node.classList;
    var parts = name.split(/\s+/);
    for (var i = 0, n = parts.length; i < n; ++i) {
        if (parts[i])
            list.remove(parts[i]);
    }
}
/**
 * Perform a client position hit test on an array of side bar buttons.
 *
 * Returns the index of the first matching button, or `-1`.
 */
function hitTestButtons(buttons, clientX, clientY) {
    for (var i = 0, n = buttons.length; i < n; ++i) {
        if (phosphor_domutil_1.hitTest(buttons[i].node, clientX, clientY))
            return i;
    }
    return -1;
}
