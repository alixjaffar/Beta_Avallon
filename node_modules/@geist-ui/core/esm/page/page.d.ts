import React, { CSSProperties } from 'react';
declare const renderMode: ["default", "effect", "effect-seo"];
export declare type PageRenderMode = typeof renderMode[number];
interface Props {
    render?: PageRenderMode;
    dotBackdrop?: boolean;
    dotSize?: CSSProperties['fontSize'];
    dotSpace?: number;
}
export declare type DotStylesProps = {
    dotSize: CSSProperties['fontSize'];
    dotSpace: number;
};
declare type NativeAttrs = Omit<React.HTMLAttributes<any>, keyof Props>;
export declare type PageProps = Props & NativeAttrs;
declare const Page: React.ForwardRefExoticComponent<Props & NativeAttrs & {
    children?: React.ReactNode;
} & import("../use-scale").ScaleProps & React.RefAttributes<unknown>>;
export default Page;
