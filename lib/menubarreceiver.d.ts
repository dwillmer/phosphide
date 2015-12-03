import { MenuBar } from 'phosphor-menus';
import { IExtension, IReceiver } from 'phosphor-plugins';
/**
 *
 */
export declare class MenuBarReceiver implements IReceiver {
    /**
     *
     */
    constructor(menuBar: MenuBar);
    /**
     *
     */
    dispose(): void;
    /**
     *
     */
    isDisposed: boolean;
    /**
     *
     */
    add(ext: IExtension): void;
    /**
     *
     */
    remove(id: string): void;
    private _disposed;
    private _menuBar;
    private _map;
}
