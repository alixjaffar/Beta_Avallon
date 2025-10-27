import React from 'react';
interface Props {
    className?: string;
}
declare type NativeAttrs = Omit<React.HTMLAttributes<any>, keyof Props>;
export declare type SpinnerProps = Props & NativeAttrs;
declare const Spinner: React.ForwardRefExoticComponent<Props & NativeAttrs & import("../use-scale").ScaleProps & React.RefAttributes<unknown>>;
export default Spinner;
