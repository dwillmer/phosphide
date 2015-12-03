import { BoxPanel } from 'phosphor-boxpanel';
import { DockPanel } from 'phosphor-dockpanel';
import { MenuBar } from 'phosphor-menus';
import { SplitPanel } from 'phosphor-splitpanel';
import { StackedPanel } from 'phosphor-stackedpanel';
import { Widget } from 'phosphor-widget';
import { SideBar } from './sidebar';
/**
 *
 */
export declare class MainPanel extends BoxPanel {
    /**
     *
     */
    constructor();
    /**
     *
     */
    dispose(): void;
    /**
     *
     */
    menuBar: MenuBar;
    /**
     *
     */
    boxPanel: BoxPanel;
    /**
     *
     */
    dockPanel: DockPanel;
    /**
     *
     */
    splitPanel: SplitPanel;
    /**
     *
     */
    leftSideBar: SideBar<Widget>;
    /**
     *
     */
    rightSideBar: SideBar<Widget>;
    /**
     *
     */
    leftStackedPanel: StackedPanel;
    /**
     *
     */
    rightStackedPanel: StackedPanel;
    private _menuBar;
    private _boxPanel;
    private _dockPanel;
    private _splitPanel;
    private _leftSideBar;
    private _rightSideBar;
    private _leftStackedPanel;
    private _rightStackedPanel;
}
