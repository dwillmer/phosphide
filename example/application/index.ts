/*-----------------------------------------------------------------------------
| Copyright (c) 2014-2016, PhosphorJS Contributors
|
| Distributed under the terms of the BSD 3-Clause License.
|
| The full license is in the file LICENSE, distributed with this software.
|----------------------------------------------------------------------------*/
'use strict';

import {
  IAppShell, ICommandPalette, IShortcutManager
} from 'phosphide';

import {
  Container, Token
} from 'phosphor-di';


export
function resolve(container: Container): Promise<void> {
  return container.resolve(Application).catch(error => {
    console.warn('Application instance failed to load:', error);
  });
}

/**
 * Application injects the UI chrome (palette, menus, etc.) into an `IAppShell`.
 */
class Application {

  static requires: Token<any>[] = [IAppShell, ICommandPalette, IShortcutManager];

  static create(shell: IAppShell, palette: ICommandPalette, shortcuts: IShortcutManager): Application {
    palette.setShortcutManager(shortcuts);
    return new Application(shell, palette);
  }

  constructor(shell: IAppShell, palette: ICommandPalette) {
    palette.title.text = 'Commands';
    shell.addToLeftArea(palette, { rank: 40 });
    shell.attach(document.body);
    window.addEventListener('resize', () => { shell.update(); });
  }
}
