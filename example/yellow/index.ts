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
  return container.resolve(YellowHandler).then(handler => { handler.run(); });
}


class YellowHandler {

  static requires = [IAppShell, ICommandPalette, IKeymapManager];

  static create(shell: IAppShell, palette: ICommandPalette, keymap: IKeymapManager): YellowHandler {
    return new YellowHandler(shell, palette, keymap);
  }

  constructor(shell: IAppShell, palette: ICommandPalette, keymap: IKeymapManager) {
    this._shell = shell;
    this._palette = palette;
    this._keymap = keymap;
  }

  run(): void {
    let widget = new Widget();
    widget.addClass('yellow-content');
    widget.title.text = 'Yellow';
    this._shell.addToLeftArea(widget, { rank: 20 });

    this._keymap.add([
      {
        sequence: ['Alt Y'],
        selector: '*',
        command: 'demo:colors:yellow-0'
      }
    ]);

    this._palette.add([
      {
        text: 'All colors',
        items: [
          {
            id: 'demo:colors:yellow-0',
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
  private _palette: ICommandPalette;
  private _keymap: IKeymapManager;
}
