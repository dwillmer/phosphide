import { IExtension, IReceiver } from 'phosphor-plugins';
import { StackedPanel } from 'phosphor-stackedpanel';
import { Widget } from 'phosphor-widget';
import { SideBar } from './sidebar';
/**
 *
 */
export declare class SideBarReceiver implements IReceiver {
    /**
     *
     */
    constructor(bar: SideBar<Widget>, stack: StackedPanel);
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
    /**
     *
     */
    private _onCurrentChanged(sender, args);
    /**
     *
     */
    private _onChildrenChanged(sender);
    private _disposed;
    private _stack;
    private _bar;
    private _map;
}
