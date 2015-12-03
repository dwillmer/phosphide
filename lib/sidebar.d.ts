import { Message } from 'phosphor-messaging';
import { IObservableList } from 'phosphor-observablelist';
import { IChangedArgs, Property } from 'phosphor-properties';
import { ISignal } from 'phosphor-signaling';
import { Title, Widget } from 'phosphor-widget';
/**
 * An object which can be added to a side bar.
 */
export interface ISideBarItem {
    /**
     * The title object which provides data for the item's button.
     *
     * #### Notes
     * This should be a read-only property.
     */
    title: Title;
}
/**
 * A widget which displays its items as a list of exclusive buttons.
 */
export declare class SideBar<T extends ISideBarItem> extends Widget {
    /**
     * Create the DOM node for a side bar.
     */
    static createNode(): HTMLElement;
    /**
     * The property descriptor for the currently selected side bar item.
     *
     * **See also:** [[currentItem]]
     */
    static currentItemProperty: Property<SideBar<ISideBarItem>, ISideBarItem>;
    /**
     * The property descriptor for the observable list of side bar items.
     *
     * **See also:** [[items]]
     */
    static itemsProperty: Property<SideBar<ISideBarItem>, IObservableList<ISideBarItem>>;
    /**
     * Construct a new side bar.
     */
    constructor();
    /**
     * Dispose of the resources held by the widget.
     */
    dispose(): void;
    /**
     * Get the currently selected side bar item.
     *
     * #### Notes
     * This is a pure delegate to the [[currentItemProperty]].
     */
    /**
     * Set the currently selected side bar item.
     *
     * #### Notes
     * This is a pure delegate to the [[currentItemProperty]].
     */
    currentItem: T;
    /**
     * A signal emitted when the current side bar item is changed.
     *
     * #### Notes
     * This is the notify signal for the [[currentItemProperty]].
     */
    currentItemChanged: ISignal<SideBar<T>, IChangedArgs<T>>;
    /**
     * Get the list of side bar items for the side bar.
     *
     * #### Notes
     * This is a pure delegate to the [[itemsProperty]].
     */
    /**
     * Set the list side bar items for the side bar.
     *
     * #### Notes
     * This is a pure delegate to the [[itemsProperty]].
     */
    items: IObservableList<T>;
    /**
     * Get the side bar content node.
     *
     * #### Notes
     * This is the node which holds the side bar button nodes. Modifying
     * the content of this node indiscriminately can lead to undesired
     * behavior.
     */
    contentNode: HTMLElement;
    /**
     * Handle the DOM events for the side bar.
     *
     * @param event - The DOM event sent to the side bar.
     *
     * #### Notes
     * This method implements the DOM `EventListener` interface and is
     * called in response to events on the side bar's DOM node. It should
     * not be called directly by user code.
     */
    handleEvent(event: Event): void;
    /**
     * A message handler invoked on an `'after-attach'` message.
     */
    protected onAfterAttach(msg: Message): void;
    /**
     * A message handler invoked on a `'before-detach'` message.
     */
    protected onBeforeDetach(msg: Message): void;
    /**
     * Handle the `'mousedown'` event for the side bar.
     */
    private _evtMouseDown(event);
    /**
     * The coerce handler for the [[currentItemProperty]].
     */
    private _coerceCurrentItem(item);
    /**
     * The change handler for the [[currentItemProperty]].
     */
    private _onCurrentItemChanged(oldItem, newItem);
    /**
     * The change handler for the [[itemsProperty]].
     */
    private _onItemsChanged(oldList, newList);
    /**
     * The change handler for the items list `changed` signal.
     */
    private _onItemsListChanged(sender, args);
    /**
     * The handler invoked on a items list change of type `Add`.
     */
    private _onItemsListAdd(args);
    /**
     * The handler invoked on a items list change of type `Move`.
     */
    private _onItemsListMove(args);
    /**
     * The handler invoked on an items list change of type `Remove`.
     */
    private _onItemsListRemove(args);
    /**
     * The handler invoked on a items list change of type `Replace`.
     */
    private _onItemsListReplace(args);
    /**
     * The handler invoked on a items list change of type `Set`.
     */
    private _onItemsListSet(args);
    private _buttons;
}
