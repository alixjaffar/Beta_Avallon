import React, { MouseEvent } from 'react';
interface Props {
    disableBackdropClick?: boolean;
    onClose?: () => void;
    onContentClick?: (event: MouseEvent<HTMLElement>) => void;
    visible?: boolean;
    keyboard?: boolean;
    wrapClassName?: string;
    positionClassName?: string;
    backdropClassName?: string;
    layerClassName?: string;
}
declare type NativeAttrs = Omit<React.HTMLAttributes<any>, keyof Props>;
export declare type ModalProps = Props & NativeAttrs;
declare const Modal: React.ForwardRefExoticComponent<Props & NativeAttrs & {
    children?: React.ReactNode;
} & import("../use-scale").ScaleProps & React.RefAttributes<unknown>>;
export default Modal;
