/// <reference types="react" />
import { Toast } from "./use-toast";
import { GeistUIThemesPalette } from "../themes";
export declare const makeToastActions: (actions: Toast['actions'], cancelHandle: () => void) => JSX.Element[] | null;
export declare const getColors: (palette: GeistUIThemesPalette, type?: "secondary" | "success" | "error" | "warning" | "default" | undefined) => {
    bgColor: string;
    color: string;
};
declare const toastPlacement: ["topLeft", "topRight", "bottomLeft", "bottomRight"];
export declare type ToastPlacement = typeof toastPlacement[number];
export declare const isTopPlacement: (placement: ToastPlacement) => boolean;
export declare const isLeftPlacement: (placement: ToastPlacement) => boolean;
export declare const getTranslateByPlacement: (placement: ToastPlacement) => {
    enter: string;
    leave: string;
};
export {};
