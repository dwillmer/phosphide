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
  IKeyBinding
} from 'phosphor-keymap';

import {
  IKeymapManager
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
  container.register(IKeymapManager, KeymapManager);
}

/**
 * A class which manages a collection of key bindings.
 */
export
class KeymapManager {
  /**
   * The dependencies required by the keymap manager.
   */
  static requires: Token<any>[] = [ICommandRegistry];

  /**
   * Create a new keymap manager instance.
   */
  static create(registry: ICommandRegistry): IKeymapManager {
    return new KeymapManager(registry);
  }

  /**
   * Construct a new key map manager.
   *
   * @param layout - The keyboard layout to use with the manager.
   *   The default layout is US English.
   */
  constructor(registry: ICommandRegistry, layout: IKeyboardLayout = EN_US) {
    this._registry = registry;
    this._layout = layout;

    // Setup the keydown listener for the document.
    document.addEventListener('keydown', event => {
      this.processKeydownEvent(event);
    });
  }

  /**
   * Get the keyboard layout used by the manager.
   *
   * #### Notes
   * This is a read-only property.
   */
  get layout(): IKeyboardLayout {
    return this._layout;
  }

  /**
   * Add key bindings to the key map manager.
   *
   * @param bindings - The key bindings to add to the manager.
   *
   * @returns A disposable which removes the added key bindings.
   *
   * #### Notes
   * If a key binding is invalid, a warning will be logged to the
   * console and the offending key binding will be ignored.
   *
   * If multiple key bindings are registered for the same sequence,
   * the binding with the highest CSS specificity is executed first.
   * Ties in specificity are broken based on the order in which the
   * key bindings are added to the manager, with newer binding
   * taking precedence.
   *
   * Ambiguous key bindings are resolved with a timeout.
   */
  add(bindings: IKeyBinding[]): IDisposable {
    var exbArray = bindings.map(binding => {
      return createExBinding(binding, this._layout);
    }).filter(exBinding => !!exBinding);
    this._bindings = this._bindings.concat(exbArray);
    return new DisposableDelegate(() => this._removeBindings(exbArray));
  }

  /**
   * Test whether a command with a specific id is registered.
   *
   * @param id - The id of the command of interest.
   *
   * @returns `true` if the command is registered, `false` otherwise.
   */
  has(id: string): boolean {
    for (let i = 0; i < this._bindings.length; ++i) {
      if (this._bindings[i].command === id) {
        return true;
      }
    }
    return false;
  }

  /**
   * Lookup a command with a specific id.
   *
   * @param id - The id of the command of interest.
   *
   * @returns The keybinding for the specified id, or `undefined`.
   */
  get(id: string): string {
    for (let i = 0; i < this._bindings.length; ++i) {
      if (this._bindings[i].command === id) {
        return this._bindings[i].sequence[0]; // TODO
      }
    }
  }

  /**
   * Process a `'keydown'` event and invoke a matching key binding.
   *
   * @param event - The event object for a `'keydown'` event.
   *
   * #### Notes
   * This should be called in response to a `'keydown'` event in order
   * to invoke the command of the best matching key binding.
   *
   * The manager **does not** install its own key event listeners. This
   * allows user code full control over the nodes for which the manager
   * processes `'keydown'` events.
   */
  processKeydownEvent(event: KeyboardEvent): void {
    // Get the canonical keystroke for the event. An empty string
    // indicates a keystroke which cannot be a valid key shortcut.
    var keystroke = keystrokeForKeydownEvent(event, this._layout);
    if (!keystroke) {
      return;
    }

    // Add the keystroke to the current key sequence.
    this._sequence.push(keystroke);

    // Find the exact and partial matches for the key sequence.
    var matches = findSequenceMatches(this._bindings, this._sequence);

    // If there are no exact matches and no partial matches, clear
    // all pending state so the next key press starts from default.
    if (matches.exact.length === 0 && matches.partial.length === 0) {
      this._clearPendingState();
      return;
    }

    // If there are exact matches but no partial matches, the exact
    // matches can be dispatched immediately. The pending state is
    // cleared so the next key press starts from default.
    if (matches.partial.length === 0) {
      this._clearPendingState();
      dispatchBindings(matches.exact, event, this._registry);
      return;
    }

    // If there are both exact matches and partial matches, the exact
    // matches are stored so that they can be dispatched if the timer
    // expires before a more specific match is found.
    if (matches.exact.length > 0) {
      this._exactData = { exact: matches.exact, event: event };
    }

    // (Re)start the timer to trigger the most recent exact match in
    // the event the pending partial match fails to result in a final
    // unambiguous exact match.
    //
    // TODO - we may want to replay events if an exact match fails.
    event.preventDefault();
    event.stopPropagation();
    this._startTimer();
  }

  /**
   * Remove an array of extended bindings from the key map.
   */
  private _removeBindings(array: IExBinding[]): void {
    this._bindings = this._bindings.filter(exb => array.indexOf(exb) === -1);
  }

  /**
   * Start or restart the pending timer for the key map.
   */
  private _startTimer(): void {
    this._clearTimer();
    this._timer = setTimeout(() => {
      this._onPendingTimeout();
    }, 1000);
  }

  /**
   * Clear the pending timer for the key map.
   */
  private _clearTimer(): void {
    if (this._timer !== 0) {
      clearTimeout(this._timer);
      this._timer = 0;
    }
  }

  /**
   * Clear the pending state for the keymap.
   */
  private _clearPendingState(): void {
    this._clearTimer();
    this._exactData = null;
    this._sequence.length = 0;
  }

  /**
   * Handle the partial match timeout.
   */
  private _onPendingTimeout(): void {
    var data = this._exactData;
    this._timer = 0;
    this._exactData = null;
    this._sequence.length = 0;
    if (data) dispatchBindings(data.exact, data.event, this._registry);
  }

  private _timer = 0;
  private _layout: IKeyboardLayout;
  private _sequence: string[] = [];
  private _bindings: IExBinding[] = [];
  private _exactData: IExactData = null;
  private _registry: ICommandRegistry = null;
}


/**
 * An extended key binding object which holds extra data.
 */
interface IExBinding extends IKeyBinding {
  /**
   * The specificity of the CSS selector.
   */
  specificity: number;
}


/**
 * An object which holds pending exact match data.
 */
interface IExactData {
  /**
   * The exact match bindings.
   */
  exact: IExBinding[];

  /**
   * The keyboard event which triggered the exact match.
   */
  event: KeyboardEvent;
}


/**
 * An object which holds the results of a sequence match.
 */
interface IMatchResult {
  /**
   * The bindings which exactly match the key sequence.
   */
  exact: IExBinding[];

  /**
   * The bindings which partially match the key sequence.
   */
  partial: IExBinding[];
}


/**
 * Create an extended key binding from a user key binding.
 *
 * Warns and returns `null` if the key binding is invalid.
 */
function createExBinding(binding: IKeyBinding, layout: IKeyboardLayout): IExBinding {
  if (!isSelectorValid(binding.selector)) {
    console.warn(`invalid key binding selector: ${binding.selector}`);
    return null;
  }
  if (binding.sequence.length === 0) {
    console.warn('empty key sequence for key binding');
    return null;
  }
  if (!binding.command) {
    console.warn('null command for key binding');
    return null;
  }
  try {
    var sequence = binding.sequence.map(ks => normalizeKeystroke(ks, layout));
  } catch (e) {
    console.warn(e.message);
    console.warn(`invalid key binding sequence: ${binding.sequence}`);
    return null;
  }
  return {
    sequence: sequence,
    command: binding.command,
    selector: binding.selector,
    specificity: calculateSpecificity(binding.selector),
  };
}


/**
 * An enum which describes the possible sequence matches.
 */
const enum SequenceMatch { None, Exact, Partial };


/**
 * Test whether an ex binding matches a key sequence.
 *
 * Returns a `SequenceMatch` value indicating the type of match.
 */
function matchSequence(exb: IExBinding, sequence: string[]): SequenceMatch {
  if (exb.sequence.length < sequence.length) {
    return SequenceMatch.None;
  }
  for (var i = 0, n = sequence.length; i < n; ++i) {
    if (exb.sequence[i] !== sequence[i]) {
      return SequenceMatch.None;
    }
  }
  if (exb.sequence.length > sequence.length) {
    return SequenceMatch.Partial;
  }
  return SequenceMatch.Exact;
}


/**
 * Find the extended bindings which match a key sequence.
 *
 * Returns a match result which contains the exact and partial matches.
 */
function findSequenceMatches(bindings: IExBinding[], sequence: string[]): IMatchResult {
  var exact: IExBinding[] = [];
  var partial: IExBinding[] = [];
  for (var i = 0, n = bindings.length; i < n; ++i) {
    var match = matchSequence(bindings[i], sequence);
    if (match === SequenceMatch.Exact) {
      exact.push(bindings[i]);
    } else if (match === SequenceMatch.Partial) {
      partial.push(bindings[i]);
    }
  }
  return { exact: exact, partial: partial };
}


/**
 * Find the best matching binding for the given target element.
 *
 * Returns `undefined` if no matching binding is found.
 */
function findBestMatch(bindings: IExBinding[], target: Element): IExBinding {
  var result: IExBinding = void 0;
  for (var i = 0, n = bindings.length; i < n; ++i) {
    var exb = bindings[i];
    if (!matchesSelector(target, exb.selector)) {
      continue;
    }
    if (!result || exb.specificity >= result.specificity) {
      result = exb;
    }
  }
  return result;
}


/**
 * Dispatch the key bindings for the given keyboard event.
 *
 * As the dispatcher walks up the DOM, the bindings will be filtered
 * for the best matching keybinding. If a match is found, the handler
 * is invoked and event propagation is stopped.
 */
function dispatchBindings(bindings: IExBinding[], event: KeyboardEvent, registry: ICommandRegistry): void {
  var target = event.target as Element;
  while (target) {
    var match = findBestMatch(bindings, target);
    if (match) {
      event.preventDefault();
      event.stopPropagation();
      registry.execute(match.command, null); // TODO - args.
      return;
    }
    if (target === event.currentTarget) {
      return;
    }
    target = target.parentElement;
  }
}


/**
 * Test whether an element matches a CSS selector.
 */
function matchesSelector(elem: Element, selector: string): boolean {
  return protoMatchFunc.call(elem, selector);
}


/**
 * A cross-browser CSS selector matching prototype function.
 *
 * This function must be called with an element as `this` context.
 */
var protoMatchFunc: Function = (() => {
  var proto = Element.prototype as any;
  return (
    proto.matches ||
    proto.matchesSelector ||
    proto.mozMatchesSelector ||
    proto.msMatchesSelector ||
    proto.oMatchesSelector ||
    proto.webkitMatchesSelector ||
    (function(selector: string) {
      var elem = this as Element;
      var matches = elem.ownerDocument.querySelectorAll(selector);
      return Array.prototype.indexOf.call(matches, elem) !== -1;
    })
  );
})();
