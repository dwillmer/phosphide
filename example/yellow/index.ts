/*-----------------------------------------------------------------------------
| Copyright (c) 2014-2015, PhosphorJS Contributors
|
| Distributed under the terms of the BSD 3-Clause License.
|
| The full license is in the file LICENSE, distributed with this software.
|----------------------------------------------------------------------------*/
'use strict';

import {
  IAppShell, ICommandRegistry, ICommandPalette, IShortcutManager
} from 'phosphide';

import {
  DelegateCommand
} from 'phosphor-command';

import {
  Container
} from 'phosphor-di';

import {
  Widget
} from 'phosphor-widget';


export
function resolve(container: Container): Promise<void> {
  return container.resolve(YellowHandler).then(handler => { handler.run(); });
}


class YellowHandler {

  static requires = [IAppShell, ICommandRegistry, ICommandPalette, IShortcutManager];

  static create(shell: IAppShell, registry: ICommandRegistry, palette: ICommandPalette, shortcuts: IShortcutManager): YellowHandler {
    return new YellowHandler(shell, registry, palette, shortcuts);
  }

  constructor(shell: IAppShell, registry: ICommandRegistry, palette: ICommandPalette, shortcuts: IShortcutManager) {
    this._shell = shell;
    this._palette = palette;
    this._registry = registry;
    this._shortcuts = shortcuts;
  }

  run(): void {
    let widget = new Widget();
    widget.addClass('yellow-content');
    widget.title.text = 'Yellow';
    this._shell.addToLeftArea(widget, { rank: 20 });

    let yellowZeroId = 'demo:colors:yellow-0';
    let yellowCommand = new DelegateCommand(() => {
      console.log('Yellow command invoked');
    });

    this._registry.add([
      {
        id: yellowZeroId,
        command: yellowCommand
      }
    ]);

    this._shortcuts.add([
      {
        sequence: ['Alt Y'],
        selector: '*',
        command: yellowCommand
      }
    ]);

    this._palette.add([
      {
        text: 'All colors',
        items: [
          {
            id: yellowZeroId,
            title: 'Yellow',
            caption: 'Yellow is best!'
          }
        ]
      },
      {
        text: 'Yellow',
        items: [
          {
            id: 'demo:colors:yellow-1',
            title: 'Yellow #1',
            caption: 'Yellow number one'
          },
          {
            id: 'demo:colors:yellow-2',
            title: 'Yellow #2',
            caption: 'Yellow number two'
          },
          {
            id: 'demo:colors:yellow-3',
            title: 'Yellow #3',
            caption: 'Yellow number three'
          },
          {
            id: 'demo:colors:yellow-4',
            title: 'Yellow #4',
            caption: 'Yellow number four'
          },
          {
            id: 'demo:colors:yellow-5',
            title: 'Yellow #5',
            caption: 'Yellow number five'
          }
        ]
      }
    ]);
  }

  private _shell: IAppShell;
  private _registry: ICommandRegistry;
  private _palette: ICommandPalette;
  private _shortcuts: IShortcutManager;
}
