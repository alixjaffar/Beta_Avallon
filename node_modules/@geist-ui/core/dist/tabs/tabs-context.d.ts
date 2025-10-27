import React, { CSSProperties, MouseEvent } from 'react';
export declare type TabsInternalCellProps = {
    onClick: (value: string) => void;
    onMouseOver: (e: MouseEvent<HTMLDivElement>) => void;
    activeClassName?: string;
    activeStyle?: CSSProperties;
    hideBorder?: boolean;
};
export declare type TabsInternalCell = React.FC<TabsInternalCellProps>;
export interface TabsHeaderItem {
    value: string;
    cell: TabsInternalCell;
}
export interface TabsConfig {
    register?: (item: TabsHeaderItem) => void;
    currentValue?: string;
    inGroup: boolean;
    leftSpace?: CSSProperties['marginLeft'];
}
export declare const TabsContext: React.Context<TabsConfig>;
export declare const useTabsContext: () => TabsConfig;
