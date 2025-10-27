import React, { CSSProperties } from 'react';
import type { NormalTypes } from "../utils/prop-types";
import { ToastPlacement } from "./helpers";
export interface ToastAction {
    name: string;
    handler: (event: React.MouseEvent<HTMLButtonElement>, cancel: () => void) => void;
    passive?: boolean;
}
export declare type ToastTypes = NormalTypes;
export declare type ToastLayout = {
    padding?: CSSProperties['padding'];
    margin?: CSSProperties['margin'];
    width?: CSSProperties['width'];
    maxWidth?: CSSProperties['maxWidth'];
    maxHeight?: CSSProperties['maxHeight'];
    placement?: ToastPlacement;
};
export interface ToastInput {
    text: string | React.ReactNode;
    type?: ToastTypes;
    id?: string;
    delay?: number;
    actions?: Array<ToastAction>;
}
export declare type ToastInstance = {
    visible: boolean;
    cancel: () => void;
    _timeout: null | number;
    _internalIdent: string;
};
export declare type Toast = Required<ToastInput> & ToastInstance;
export declare type ToastHooksResult = {
    toasts: Array<Toast>;
    setToast: (toast: ToastInput) => void;
    removeAll: () => void;
    findToastOneByID: (ident: string) => Toast | undefined;
    removeToastOneByID: (ident: string) => void;
};
declare const useToasts: (layout?: ToastLayout | undefined) => ToastHooksResult;
export default useToasts;
