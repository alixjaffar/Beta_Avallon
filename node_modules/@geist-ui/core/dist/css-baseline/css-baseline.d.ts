import React, { ReactElement } from 'react';
export declare type FlushToReact = <T>(opts?: {
    nonce?: string;
}) => Array<ReactElement<T>>;
export declare type FlushToHTML = (opts?: {
    nonce?: string;
}) => string;
declare type MemoCssBaselineComponent<P = {}> = React.NamedExoticComponent<P> & {
    flush: FlushToReact;
    flushToHTML: FlushToHTML;
};
declare const MemoCssBaseline: MemoCssBaselineComponent<{
    children?: React.ReactNode;
}>;
export default MemoCssBaseline;
