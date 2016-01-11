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


class ShortcutManager {

  static requires: Token<any>[] = [ICommandRegistry];

  /**
   * Create a new shortcut manager instance.
   */
  static create(): ShortcutManager {
    return new ShortcutManager();
  }

  /**
   * Construct a shortcut manager.
   */
  constructor() {
    this._keymap = new KeymapManager();
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

  }

  private _keymap: KeymapManager = null;
}
