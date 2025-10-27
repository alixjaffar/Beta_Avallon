import React from 'react';
import { ScaleProps } from "./scale-context";
declare const withScale: <T, P = {}>(Render: React.ComponentType<P & {
    ref?: React.Ref<T> | undefined;
}>) => React.ForwardRefExoticComponent<React.PropsWithoutRef<P & ScaleProps> & React.RefAttributes<T>>;
export default withScale;
