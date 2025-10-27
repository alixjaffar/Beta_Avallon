import React from 'react';
import { ReactiveDomReact } from "../utils/layouts";
declare type Props = {
    rect: ReactiveDomReact;
    visible?: boolean;
    hoverHeightRatio?: number;
    hoverWidthRatio?: number;
    activeOpacity?: number;
};
declare type NativeAttrs = Omit<React.HTMLAttributes<any>, keyof Props>;
export declare type HighlightProps = Props & NativeAttrs;
declare const Highlight: React.FC<HighlightProps>;
export default Highlight;
