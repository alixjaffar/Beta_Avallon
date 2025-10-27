import React from 'react';
import { NormalTypes } from "../utils/prop-types";
export declare type ButtonDropdownTypes = NormalTypes;
interface Props {
    type?: ButtonDropdownTypes;
    auto?: boolean;
    loading?: boolean;
    disabled?: boolean;
    className?: string;
    icon?: React.ReactNode;
}
declare type NativeAttrs = Omit<React.HTMLAttributes<any>, keyof Props>;
export declare type ButtonDropdownProps = Props & NativeAttrs;
declare const ButtonDropdown: React.ForwardRefExoticComponent<Props & NativeAttrs & {
    children?: React.ReactNode;
} & import("../use-scale").ScaleProps & React.RefAttributes<unknown>>;
export default ButtonDropdown;
