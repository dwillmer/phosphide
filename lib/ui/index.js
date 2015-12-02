/*-----------------------------------------------------------------------------
| Copyright (c) 2014-2015, PhosphorJS Contributors
|
| Distributed under the terms of the BSD 3-Clause License.
|
| The full license is in the file LICENSE, distributed with this software.
|----------------------------------------------------------------------------*/
'use strict';
var phosphor_disposable_1 = require('phosphor-disposable');
var phosphor_dockpanel_1 = require('phosphor-dockpanel');
// import {
//   Tab
// } from 'phosphor-tabs';
var phosphor_widget_1 = require('phosphor-widget');
require('./index.css');
/**
 * The interface for `ui` extension point.
 */
// export
// interface IUIExtension {
//   items: Widget[];
//   tabs: Tab[];
// }
/**
 * The factory function for the `ui:main` extension point.
 */
function createUIReceiver() {
    return {
        add: function (extension) {
            //console.log("UI Receiver 'add' called..." + Object.keys(extension).toString());
            console.log("UI item: " + extension.item);
            if (extension.item && extension.item.hasOwnProperty('item')) {
                console.log('adding...');
                //let items = extension.item.items;
                for (var i = 0; i < extension.item.length; ++i) {
                    console.log("UI Receiver adding item to dockarea");
                    dockarea.insertRight(extension.item[i]);
                }
            }
            return new phosphor_disposable_1.DisposableDelegate(function () {
                // TODO: remove the items from the dockarea once the API is updated.
            });
        },
        remove: function (id) {
            if (id in dockarea) {
            }
        },
        dispose: function () {
        },
        isDisposed: false
    };
}
exports.createUIReceiver = createUIReceiver;
/**
 * The receiver for the `ui:main` extension point.
 */
// export
// function receiveMain(extension: IExtension): IDisposable {
//
// }
/**
 * The initializer for the `ui:main` extension point.
 */
// export
// function initializeMain(): Promise<IDisposable> {
//   Widget.attach(dockarea, document.body);
//   window.onresize = () => dockarea.update();
//   return Promise.resolve(dockarea);
// }
// global dockpanel
var dockarea = new phosphor_dockpanel_1.DockPanel();
dockarea.id = 'main';
phosphor_widget_1.Widget.attach(dockarea, document.body);
window.onresize = function () { return dockarea.update(); };
