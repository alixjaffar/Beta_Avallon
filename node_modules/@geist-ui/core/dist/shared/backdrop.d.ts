import React, { MouseEvent } from 'react';
interface Props {
    onClick?: (event: MouseEvent<HTMLElement>) => void;
    visible?: boolean;
    width?: string;
    onContentClick?: (event: MouseEvent<HTMLElement>) => void;
    backdropClassName?: string;
    positionClassName?: string;
    layerClassName?: string;
}
declare type NativeAttrs = Omit<React.HTMLAttributes<any>, keyof Props>;
export declare type BackdropProps = Props & NativeAttrs;
declare const Backdrop: React.FC<React.PropsWithChildren<BackdropProps>>;
export default Backdrop;
