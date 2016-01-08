/*-----------------------------------------------------------------------------
| Copyright (c) 2014-2015, PhosphorJS Contributors
|
| Distributed under the terms of the BSD 3-Clause License.
|
| The full license is in the file LICENSE, distributed with this software.
|----------------------------------------------------------------------------*/
'use strict';

import {
  Token
} from 'phosphor-di';

import {
  IDisposable
} from 'phosphor-disposable';

import {
  IKeyboardLayout, IKeyBinding
} from 'phosphor-keymap';

/**
 * An object which can be added to a keymap manager.
 *
 * This stores the mapping of command id to key sequence.
 */
export
interface IKeymapItem {
  /**
   * The unique id for the command.
   */
  id: string;

  /**
   * The sequence to add to the manager.
   */
  binding: IKeyBinding;
}


export
interface IKeymapManager {

  /**
   * Add key bindings to the key map manager.
   *
   * @param bindings - The key bindings to add to the manager.
   *
   * @returns A disposable which removes the added key bindings.
   */
  add(bindings: IKeyBinding[]): IDisposable;

  /**
   * Test whether a command with a specific id is registered.
   *
   * @param id - The id of the command of interest.
   *
   * @returns `true` if the command is registered, `false` otherwise.
   */
  has(id: string): boolean;

  /**
   * Lookup a command with a specific id.
   *
   * @param id - The id of the command of interest.
   *
   * @returns The keybinding for the specified id, or `undefined`.
   */
  get(id: string): string;

  /**
   * Process a `'keydown'` event and invoke a matching key binding.
   *
   * @param event - The event object for a `'keydown'` event.
   */
  processKeydownEvent(event: KeyboardEvent): void;
}


/**
 * The dependency token for the `ICommandRegistry` interface.
 */
export
const IKeymapManager = new Token<IKeymapManager>('phosphide.IKeymapManager');
