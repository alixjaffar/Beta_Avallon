import React from 'react';
import type { Toast, ToastLayout } from "./use-toast";
export interface ToastItemProps {
    toast: Toast;
    layout: Required<ToastLayout>;
}
declare const ToastItem: React.FC<ToastItemProps>;
export default ToastItem;
