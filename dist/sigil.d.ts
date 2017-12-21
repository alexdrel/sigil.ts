export declare function notnull<T>(v: T, v1: T, v2?: T): T | null | undefined;
export declare function defined<T>(v: T, v1: T, v2?: T): T | null | undefined;
export declare function maybe<T, R>(v: T | undefined | null, func: (vv: T) => R): R | undefined | null;
export declare const NotNull: (v: any) => boolean;
export declare const Defined: (v: any) => boolean;
export declare const Truly: (v: any) => boolean;
export declare function HostNull<T>(_v: any, k: keyof T, t: T): boolean;
export declare function HostUndefined<T>(_v: any, k: keyof T, t: T): boolean;
export declare function NotIn<T>(_v: any, k: keyof T, t: T): boolean;
export declare type VK<T, R> = (v: any, k: keyof T, t: T) => R;
export declare type Few<T> = T | T[];
export declare type Partial<T> = {
    [P in keyof T]?: T[P];
};
export declare function forEach<T extends object>(func: VK<T, void>, source: T): void;
export declare function assignFieldsWhen<T extends object>(fields: (keyof T)[] | true, filter: VK<T, boolean> | true, target: T, sourceS: Few<Partial<T>>): T;
export declare function assignFields<T extends object>(fields: (keyof T)[], target: T, sources: Few<Partial<T>>): T;
export declare function assignWhen<T extends object>(filter: VK<T, boolean> | true, target: T, sources: Few<Partial<T>>): T;
export declare function assign<T extends object>(target: T, ...sources: Partial<T>[]): T;
export declare function boolean(v: any, d?: boolean): boolean | null | undefined;
export declare function number(v: any, d?: number): number | null | undefined;
export declare function string(v: any, d?: string): string | null | undefined;
