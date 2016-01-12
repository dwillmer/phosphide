/*-----------------------------------------------------------------------------
| Copyright (c) 2014-2015, PhosphorJS Contributors
|
| Distributed under the terms of the BSD 3-Clause License.
|
| The full license is in the file LICENSE, distributed with this software.
|----------------------------------------------------------------------------*/
'use strict';

import {
  calculateSpecificity, isSelectorValid
} from 'clear-cut';

import {
  Token, Container
} from 'phosphor-di';

import {
  DisposableDelegate, IDisposable
} from 'phosphor-disposable';

import {
  EN_US, IKeyboardLayout, keystrokeForKeydownEvent, normalizeKeystroke,
  IKeyBinding, KeymapManager
} from 'phosphor-keymap';

import {
  IShortcutManager
} from './index';

import {
  ICommandRegistry
} from '../commandregistry/index';

/**
 * Register the plugin contributions.
 *
 * @param container - The di container for type registration.
 *
 * #### Notes
 * This is called automatically when the plugin is loaded.
 */
export
function register(container: Container): void {
  container.register(IShortcutManager, ShortcutManager);
}


export
class ShortcutManager {

  static requires: Token<any>[] = [ICommandRegistry];

  /**
   * Create a new shortcut manager instance.
   */
  static create(commands: ICommandRegistry): IShortcutManager {
    return new ShortcutManager(commands);
  }

  /**
   * Construct a shortcut manager.
   */
  constructor(commands: ICommandRegistry) {
    this._keymap = new KeymapManager(commands);

    // Setup the keydown listener for the document.
    document.addEventListener('keydown', event => {
      this._keymap.processKeydownEvent(event);
    });
  }

  /**
   * Add key bindings to the key map manager.
   *
   * @param bindings - The key bindings to add to the manager.
   *
   * @returns A disposable which removes the added key bindings.
   */
  add(bindings: IKeyBinding[]): IDisposable {
    return this._keymap.add(bindings);
  }

  /**
   * Test whether a command with a specific id is registered.
   *
   * @param id - The id of the command of interest.
   *
   * @returns `true` if the command is registered, `false` otherwise.
   */
  has(id: string): boolean {
    return this._keymap.has(id);
  }

  /**
   * Lookup a command with a specific id.
   *
   * @param id - The id of the command of interest.
   *
   * @returns The keybinding for the specified id, or `undefined`.
   */
  get(id: string): string {
    return this._keymap.get(id);
  }

  private _keymap: KeymapManager = null;
}
