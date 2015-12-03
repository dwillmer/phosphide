import { DockPanel } from 'phosphor-dockpanel';
import { IExtension, IReceiver } from 'phosphor-plugins';
/**
 *
 */
export declare class DockPanelReceiver implements IReceiver {
    /**
     *
     */
    constructor(dockPanel: DockPanel);
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
    private _dockPanel;
    private _map;
}
