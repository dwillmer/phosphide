/*-----------------------------------------------------------------------------
| Copyright (c) 2014-2016, PhosphorJS Contributors
|
| Distributed under the terms of the BSD 3-Clause License.
|
| The full license is in the file LICENSE, distributed with this software.
|----------------------------------------------------------------------------*/
'use strict';

import {
  IAppShell, ICommandPalette, ICommandRegistry, ICommandItem, IShortcutManager
} from 'phosphide';

import {
  DelegateCommand
} from 'phosphor-command';

import {
  Container
} from 'phosphor-di';

import {
  IDisposable
} from 'phosphor-disposable';

import {
  Widget
} from 'phosphor-widget';


export
function resolve(container: Container): Promise<void> {
  return container.resolve(YellowHandler).then(handler => { handler.run(); });
}

function createCommand(id: string, disabled?: boolean): ICommandItem {
  let command = new DelegateCommand((message: string) => {
    console.log(`COMMAND: ${message}`);
  });
  if (disabled) {
    command.enabled = false;
  }
  return { id, command };
}


class YellowHandler {

  static requires = [IAppShell, ICommandPalette, ICommandRegistry, IShortcutManager];

  static create(shell: IAppShell, palette: ICommandPalette, registry: ICommandRegistry, shortcuts: IShortcutManager): YellowHandler {
    return new YellowHandler(shell, palette, registry, shortcuts);
  }

  constructor(shell: IAppShell, palette: ICommandPalette, registry: ICommandRegistry, shortcuts: IShortcutManager) {
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
    let yellowZeroCommand = createCommand(yellowZeroId);

    this._commandDisposable = this._registry.add([
      yellowZeroCommand,
      createCommand('demo:colors:yellow-1'),
      createCommand('demo:colors:yellow-2'),
      createCommand('demo:colors:yellow-3', true),
      createCommand('demo:colors:yellow-4'),
      createCommand('demo:colors:yellow-5')
    ]);

    this._shortcuts.add([
      {
        sequence: ['Alt Y'],
        selector: '*',
        command: yellowZeroCommand.command
      }
    ]);

    this._palette.add([
      {
        text: 'All colors',
        items: [
          {
            id: yellowZeroId,
            title: 'Yellow',
            caption: 'Yellow is best!',
            args: 'Yellow is best!'
          }
        ]
      },
      {
        text: 'Yellow',
        items: [
          {
            id: 'demo:colors:yellow-1',
            title: 'Yellow #1',
            caption: 'Yellow number one',
            args: 'Yellow number one'
          },
          {
            id: 'demo:colors:yellow-2',
            title: 'Yellow #2',
            caption: 'Yellow number two',
            args: 'Yellow number two'
          },
          {
            id: 'demo:colors:yellow-3',
            title: 'Yellow #3',
            caption: 'Yellow number three',
            args: 'Yellow number three'
          },
          {
            id: 'demo:colors:yellow-4',
            title: 'Yellow #4',
            caption: 'Yellow number four',
            args: 'Yellow number four'
          },
          {
            id: 'demo:colors:yellow-5',
            title: 'Yellow #5',
            caption: 'Yellow number five',
            args: 'Yellow number five'
          }
        ]
      }
    ]);
  }

  private _commandDisposable: IDisposable;
  private _shell: IAppShell;
  private _palette: ICommandPalette;
  private _registry: ICommandRegistry;
  private _shortcuts: IShortcutManager;
}
