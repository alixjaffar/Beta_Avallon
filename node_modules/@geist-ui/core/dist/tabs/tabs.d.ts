import React, { CSSProperties } from 'react';
interface Props {
    initialValue?: string;
    value?: string;
    hideDivider?: boolean;
    hideBorder?: boolean;
    highlight?: boolean;
    onChange?: (val: string) => void;
    className?: string;
    leftSpace?: CSSProperties['marginLeft'];
    hoverHeightRatio?: number;
    hoverWidthRatio?: number;
    align?: CSSProperties['justifyContent'];
    activeClassName?: string;
    activeStyles?: CSSProperties;
}
declare type NativeAttrs = Omit<React.HTMLAttributes<any>, keyof Props>;
export declare type TabsProps = Props & NativeAttrs;
declare const Tabs: React.ForwardRefExoticComponent<Props & NativeAttrs & {
    children?: React.ReactNode;
} & import("../use-scale").ScaleProps & React.RefAttributes<unknown>>;
export default Tabs;
