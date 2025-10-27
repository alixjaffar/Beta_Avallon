import { Dispatch, RefObject, SetStateAction } from 'react';
export declare type ElementStackItem = {
    overflow: string;
    paddingRight: string;
};
export declare type BodyScrollOptions = {
    scrollLayer?: boolean;
    delayReset?: number;
};
declare const useBodyScroll: (elementRef?: RefObject<HTMLElement> | null | undefined, options?: BodyScrollOptions | undefined) => [boolean, Dispatch<SetStateAction<boolean>>];
export default useBodyScroll;
