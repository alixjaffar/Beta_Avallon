import React from 'react';
interface Props {
    inline?: boolean;
    className?: string;
}
declare type NativeAttrs = Omit<React.HTMLAttributes<any>, keyof Props>;
export declare type SpacerProps = Props & NativeAttrs;
declare const Spacer: React.ForwardRefExoticComponent<Props & NativeAttrs & import("../use-scale").ScaleProps & React.RefAttributes<unknown>>;
export default Spacer;
