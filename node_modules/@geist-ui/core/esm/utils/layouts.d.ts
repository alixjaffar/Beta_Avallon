import { MouseEvent, FocusEvent, MutableRefObject } from 'react';
export declare const getElementOffset: (el?: HTMLElement | null | undefined) => {
    top: number;
    left: number;
};
export interface ReactiveDomReact {
    top: number;
    left: number;
    right: number;
    width: number;
    height: number;
    elementTop: number;
}
export declare const isUnplacedRect: (rect?: ReactiveDomReact | undefined) => boolean;
export declare const getRefRect: (ref?: MutableRefObject<HTMLElement | null> | undefined, getContainer?: (() => HTMLElement | null) | undefined) => ReactiveDomReact;
export declare const getEventRect: (event?: MouseEvent<HTMLElement, globalThis.MouseEvent> | FocusEvent<HTMLElement, Element> | undefined, getContainer?: (() => HTMLElement | null) | undefined) => ReactiveDomReact;
export declare const useRect: (initialState?: ReactiveDomReact | (() => ReactiveDomReact) | undefined) => {
    rect: ReactiveDomReact;
    setRect: (eventOrRef: MouseEvent<HTMLElement> | FocusEvent<HTMLElement> | MutableRefObject<HTMLElement | null>, getContainer?: (() => HTMLElement | null) | undefined) => void;
};
