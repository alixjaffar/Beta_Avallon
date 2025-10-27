import React from 'react';
interface Props {
    value: string;
    isLabelOnly?: boolean;
}
export declare type AutoCompleteItemProps = Props & React.HTMLAttributes<any>;
declare const AutoCompleteItem: React.ForwardRefExoticComponent<Props & React.HTMLAttributes<any> & {
    children?: React.ReactNode;
} & import("../use-scale").ScaleProps & React.RefAttributes<unknown>>;
export default AutoCompleteItem;
