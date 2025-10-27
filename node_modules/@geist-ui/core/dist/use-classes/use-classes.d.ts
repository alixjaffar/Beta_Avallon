export declare type classNamesObject = Record<string, boolean | string | number | null | undefined>;
export declare type className = string | classNamesObject | null | undefined | boolean | number;
declare const useClasses: (...classNames: Array<className>) => string;
export default useClasses;
