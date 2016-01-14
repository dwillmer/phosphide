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
  return container.resolve(GreenHandler).then(handler => { handler.run(); });
}


class GreenHandler {

  static requires = [IAppShell, ICommandRegistry, ICommandPalette, IShortcutManager];

  static create(shell: IAppShell, registry: ICommandRegistry, palette: ICommandPalette, shortcuts: IShortcutManager): GreenHandler {
    return new GreenHandler(shell, registry, palette, shortcuts);
  }

  constructor(shell: IAppShell, registry: ICommandRegistry, palette: ICommandPalette, shortcuts: IShortcutManager) {
    this._shell = shell;
    this._registry = registry;
    this._palette = palette;
    this._shortcuts = shortcuts;
  }

  run(): void {
    let widget = new Widget();
    widget.addClass('green-content');
    widget.title.text = 'Green';
    this._shell.addToRightArea(widget, { rank: 40 });

    let greenZeroId = 'demo:colors:green-0';
    let greenCommand = new DelegateCommand(() => {
      console.log('Green command invoked.');
    });

    this._registry.add([
      {
        id: greenZeroId,
        command: greenCommand
      }
    ]);

    this._shortcuts.add([
      {
        sequence: ['Ctrl Shift G'],
        selector: '*',
        command: greenCommand
      }
    ]);

    this._palette.add([
      {
        text: 'All colors',
        items: [
          {
            id: greenZeroId,
            title: 'Green',
            caption: 'Green is best!'
          }
        ]
      },
      {
        text: 'Green',
        items: [
          {
            id: 'demo:colors:green-1',
            title: 'Green #1',
            caption: 'Green number one'
          },
          {
            id: 'demo:colors:green-2',
            title: 'Green #2',
            caption: 'Green number two'
          },
          {
            id: 'demo:colors:green-3',
            title: 'Green #3',
            caption: 'Green number three'
          },
          {
            id: 'demo:colors:green-4',
            title: 'Green #4',
            caption: 'Green number four'
          },
          {
            id: 'demo:colors:green-5',
            title: 'Green #5',
            caption: 'Green number five'
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
