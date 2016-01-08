/*-----------------------------------------------------------------------------
| Copyright (c) 2014-2015, PhosphorJS Contributors
|
| Distributed under the terms of the BSD 3-Clause License.
|
| The full license is in the file LICENSE, distributed with this software.
|----------------------------------------------------------------------------*/
'use strict';

import {
  IAppShell, ICommandPalette, IKeymapManager
} from 'phosphide';

import {
  Container
} from 'phosphor-di';

import {
  Widget
} from 'phosphor-widget';


export
function resolve(container: Container): Promise<void> {
  return container.resolve(RedHandler).then(handler => { handler.run(); });
}


class RedHandler {

  static requires = [IAppShell, ICommandPalette, IKeymapManager];

  static create(shell: IAppShell, palette: ICommandPalette, keymap: IKeymapManager): RedHandler {
    return new RedHandler(shell, palette, keymap);
  }

  constructor(shell: IAppShell, palette: ICommandPalette, keymap: IKeymapManager) {
    this._shell = shell;
    this._palette = palette;
    this._keymap = keymap;
  }

  run(): void {
    let widget = new Widget();
    widget.addClass('red-content');
    widget.title.text = 'Red';
    this._shell.addToRightArea(widget, { rank: 30 });

    this._keymap.add([
      {
        sequence: ['Ctrl R'],
        selector: '*',
        command: 'demo:colors:red-0'
      }
    ]);

    this._palette.add([
      {
        text: 'All colors',
        items: [
          {
            id: 'demo:colors:red-0',
            title: 'Red',
            caption: 'Red is best!'
          }
        ]
      },
      {
        text: 'Red',
        items: [
          {
            id: 'demo:colors:red-1',
            title: 'Red #1',
            caption: 'Red number one'
          },
          {
            id: 'demo:colors:red-2',
            title: 'Red #2',
            caption: 'Red number two'
          },
          {
            id: 'demo:colors:red-3',
            title: 'Red #3',
            caption: 'Red number three'
          },
          {
            id: 'demo:colors:red-4',
            title: 'Red #4',
            caption: 'Red number four'
          },
          {
            id: 'demo:colors:red-5',
            title: 'Red #5',
            caption: 'Red number five'
          }
        ]
      }
    ]);
  }

  private _shell: IAppShell;
  private _palette: ICommandPalette;
  private _keymap: IKeymapManager;
}
