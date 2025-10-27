import React from 'react';
export declare const ScalePropKeys: string[];
export declare type ScaleProps = {
    width?: string | number;
    height?: string | number;
    padding?: string | number;
    margin?: string | number;
    w?: string | number;
    h?: string | number;
    paddingLeft?: string | number;
    paddingRight?: string | number;
    paddingTop?: string | number;
    paddingBottom?: string | number;
    pl?: string | number;
    pr?: string | number;
    pt?: string | number;
    pb?: string | number;
    marginLeft?: string | number;
    marginRight?: string | number;
    marginTop?: string | number;
    marginBottom?: string | number;
    ml?: string | number;
    mr?: string | number;
    mt?: string | number;
    mb?: string | number;
    px?: string | number;
    py?: string | number;
    mx?: string | number;
    my?: string | number;
    font?: string | number;
    unit?: string;
    scale?: number;
};
export declare type DynamicLayoutPipe = (scale1x: number, defaultValue?: string | number) => string;
export declare type ScaleInputKeys = 'pl' | 'pr' | 'pt' | 'pb' | 'px' | 'py' | 'ml' | 'mr' | 'mt' | 'mb' | 'mx' | 'my' | 'width' | 'height' | 'font';
export declare type DynamicScales = {
    [key in ScaleInputKeys]: DynamicLayoutPipe;
};
export declare type GetScalePropsFunction = (key: keyof ScaleProps | Array<keyof ScaleProps>) => ScaleProps[keyof ScaleProps];
export declare type GetAllScalePropsFunction = () => ScaleProps;
export interface ScaleConfig {
    SCALES: DynamicScales;
    getScaleProps: GetScalePropsFunction;
    getAllScaleProps: GetAllScalePropsFunction;
    unit: string;
}
export declare const ScaleContext: React.Context<ScaleConfig>;
export declare const useScale: () => ScaleConfig;
