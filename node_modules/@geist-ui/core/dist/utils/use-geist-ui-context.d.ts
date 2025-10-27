import React from 'react';
import type { ToastLayout, Toast } from "../use-toasts/use-toast";
export declare const defaultToastLayout: Required<ToastLayout>;
export declare type UpdateToastsFunction = (fn: (toasts: Array<Toast>) => Array<Toast>) => any;
export declare type UpdateToastsLayoutFunction = (fn: (layout: Required<ToastLayout>) => Required<ToastLayout>) => any;
export declare type UpdateToastsIDFunction = (fn: () => string | null) => any;
export interface GeistUIContextParams {
    toasts: Array<Toast>;
    updateToasts: UpdateToastsFunction;
    toastLayout: Required<ToastLayout>;
    updateToastLayout: UpdateToastsLayoutFunction;
    lastUpdateToastId: string | null;
    updateLastToastId: UpdateToastsIDFunction;
}
export declare const GeistUIContent: React.Context<GeistUIContextParams>;
export declare const useGeistUIContext: () => GeistUIContextParams;
