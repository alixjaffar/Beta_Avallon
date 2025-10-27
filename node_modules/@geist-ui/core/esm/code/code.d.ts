import React from 'react';
interface Props {
    block?: boolean;
    className?: string;
    name?: string;
    classic?: boolean;
}
declare type NativeAttrs = Omit<React.HTMLAttributes<any>, keyof Props>;
export declare type CodeProps = Props & NativeAttrs;
declare const Code: React.ForwardRefExoticComponent<Props & NativeAttrs & {
    children?: React.ReactNode;
} & import("../use-scale").ScaleProps & React.RefAttributes<unknown>>;
export default Code;
