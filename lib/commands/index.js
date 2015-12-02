/*-----------------------------------------------------------------------------
| Copyright (c) 2014-2015, PhosphorJS Contributors
|
| Distributed under the terms of the BSD 3-Clause License.
|
| The full license is in the file LICENSE, distributed with this software.
|----------------------------------------------------------------------------*/
'use strict';
var phosphor_disposable_1 = require('phosphor-disposable');
/**
 * The receiver for the `command:main` extension point.
 */
function createCommandReceiver() {
    return {
        add: function (extension) {
            var id = extension.item.id;
            if (id in commandMap) {
                throw new Error('Command already exists');
            }
            commandMap[id] = extension.item;
            return new phosphor_disposable_1.DisposableDelegate(function () {
                delete commandMap[id];
            });
        },
        remove: function (id) {
            // TODO
        },
        dispose: function () {
            // TODO
        },
        isDisposed: false
    };
}
exports.createCommandReceiver = createCommandReceiver;
/**
 * The invoker for the `command:invoke` extension point.
 */
// export
// function receiveInvoke(name: string): Promise<IDisposable> {
//   if (name in commandMap) {
//     commandMap[name].handler();
//     return Promise.resolve(void 0);
//   } else {
//     return Promise.reject(new Error("Invoker - name not found: " + name));
//   }
//   return Promise.reject(void 0);
// }
/**
 * The initializer for the `command:invoke` extension point.
 *
 * #### Notes
 * This is a no-op, and shouldn't be required.
 */
// export
// function initializeInvoker(): Promise<IDisposable> {
//   return Promise.resolve(void 0);
// }
// global command manager
var commandMap = {};
