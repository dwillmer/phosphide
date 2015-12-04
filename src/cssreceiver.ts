/*-----------------------------------------------------------------------------
| Copyright (c) 2014-2015, PhosphorJS Contributors
|
| Distributed under the terms of the BSD 3-Clause License.
|
| The full license is in the file LICENSE, distributed with this software.
|----------------------------------------------------------------------------*/
'use strict';

import {
  IDisposable
} from 'phosphor-disposable';

import {
  IExtension, IReceiver
} from 'phosphor-plugins';


/**
 *
 */
export
class CSSReceiver implements IReceiver {
  /**
   *
   */
  constructor() {
    this._map = Object.create(null);
  }

  /**
   *
   */
  dispose(): void {
    if (this._disposed) {
      return;
    }
    this._disposed = true;
    for (let id in this._map) {
      this._map[id].dispose();
    }
    this._map = null;
  }

  /**
   *
   */
  get isDisposed(): boolean {
    return this._disposed;
  }

  /**
   *
   */
  add(ext: IExtension): void {
    if (this._disposed) {
      throw new Error('Receiver is disposed.');
    }
    if (ext.id in this._map) {
      return;
    }
    if (!ext.config || typeof ext.config.path !== 'string') {
      console.warn(`Extension ${ext.id} has invalid config.`);
      return;
    }
    let path: string;
    if (ext.plugin) {
      path = `${ext.plugin}/${ext.config.path}`;
    } else {
      path = ext.config.path;
    }
    this._map[ext.id] = new CSSHandler(path);
  }

  /**
   *
   */
  remove(id: string): void {
    if (this._disposed) {
      throw new Error('Receiver is disposed.');
    }
    if (!(id in this._map)) {
      return;
    }
    let handler = this._map[id];
    delete this._map[id];
    handler.dispose();
  }

  private _disposed = false;
  private _map: { [id: string]: CSSHandler };
}


/**
 *
 */
function createLink(path: string): HTMLLinkElement {
  let link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = path;
  return link;
}


/**
 *
 */
class CSSHandler implements IDisposable {
  /**
   *
   */
  constructor(name: string) {
    this._name = name;
    this._load();
  }

  /**
   *
   */
  dispose(): void {
    if (this._disposed) {
      return;
    }
    this._disposed = true;
    this._unload();
  }

  /**
   *
   */
  get isDisposed(): boolean {
    return this._disposed;
  }

  /**
   *
   */
  private _load(): void {
    System.normalize(this._name).then(normed => {
      return System.locate({ name: normed, metadata: {} });
    }).then(path => {
      if (this._disposed) {
        return;
      }
      this._link = createLink(path);
      document.head.appendChild(this._link);
    });
  }

  /**
   *
   */
  private _unload(): void {
    if (!this._link) {
      return;
    }
    let parent = this._link.parentNode;
    if (parent) parent.removeChild(this._link);
    this._link = null;
  }

  private _name: string;
  private _disposed = false;
  private _link: HTMLLinkElement = null;
}