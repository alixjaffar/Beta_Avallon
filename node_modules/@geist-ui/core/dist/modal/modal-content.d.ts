import React from 'react';
interface Props {
    className?: string;
}
declare type NativeAttrs = Omit<React.HTMLAttributes<HTMLElement>, keyof Props>;
export declare type ModalContentProps = Props & NativeAttrs;
declare const ModalContent: React.ForwardRefExoticComponent<Props & NativeAttrs & {
    children?: React.ReactNode;
} & import("../use-scale").ScaleProps & React.RefAttributes<unknown>>;
export default ModalContent;
