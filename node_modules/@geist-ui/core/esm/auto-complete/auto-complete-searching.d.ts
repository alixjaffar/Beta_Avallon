import React from 'react';
interface Props {
    className?: string;
}
export declare type AutoCompleteSearchProps = Props & React.HTMLAttributes<any>;
declare const AutoCompleteSearch: React.ForwardRefExoticComponent<Props & React.HTMLAttributes<any> & {
    children?: React.ReactNode;
} & import("../use-scale").ScaleProps & React.RefAttributes<unknown>>;
export default AutoCompleteSearch;
