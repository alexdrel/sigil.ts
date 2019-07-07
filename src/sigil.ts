// coalesce
export function notnull<T>(v: T, v1: T, v2?: T): T | null | undefined {
  return (v != null ? v : (v1 != null ? v1 : v2));
}

export function defined<T>(v: T, v1: T, v2?: T): T | null | undefined {
  return (v !== undefined ? v : (v1 !== undefined ? v1 : v2));
}

export function maybe<T, R>(v: T | undefined | null, func: (vv: T) => R): R | undefined | null {
  return v != null ? func(v) : v as any;
}

// Predicates
// empty array and propertyless object considered falsy
function Bool(v: any, strictString?: boolean): boolean | null {
  if (v instanceof Array) {
    return v.length > 0;
  } else if (v instanceof Object) {
    let r = false;
    forEach(() => r = true, v);
    return r;
  } else if (typeof v === 'string') {
    if (!isNaN(v as any)) {
      return !!(+v);
    } else if (strictString) {
      switch (v.toLowerCase()) {
        case 'true': return true;
        case 'false': return false;
        default: return null;
      }
    }
  }
  return !!v;
}

export const NotNull = (v: any) => v != null;
export const Defined = (v: any) => v !== undefined;
export const Truly = (v: any) => Bool(v) as boolean;
// tslint:disable:variable-name
export function HostNull<T>(_v: any, k: keyof T, t: T) { return t[k] == null; }
export function HostUndefined<T>(_v: any, k: keyof T, t: T) { return t[k] === undefined; }
export function NotIn<T>(_v: any, k: keyof T, t: T) { return !(k in t); }
// tslint:enable:variable-name

// object forEach and (un-)conditional assign
export type VK<T, R, K extends keyof T = keyof T> = (v: T[K], k: keyof T, t: T) => R;
export type Few<T> = T | T[];

export function forEach<T extends object>(func: VK<T, void>, source: T): void {
  if (source != null) {
    for (const key in source) {
      if (Object.prototype.hasOwnProperty.call(source, key)) {
        func(source[key], key, source);
      }
    }
  }
}

export function assignFieldsWhen<T extends object>(
  fields: (keyof T)[] | true,
  filter: VK<T, boolean> | true,
  target: T,
  sourceS: Few<Partial<T>>,
): T {
  if (target == null || filter == null) {
    throw new TypeError("Cannot convert undefined or null to object");
  }
  const to = Object(target);
  const sources = sourceS instanceof Array ? sourceS : [sourceS];
  for (const source of sources) {
    forEach((v, k) => {
      if ((filter === true || filter(v, k, to)) &&
        (fields === true || fields.indexOf(k) >= 0)) {
        to[k] = v;
      }
    }, source as T);
  }
  return to;
}

export function assignFields<T extends object>(fields: (keyof T)[], target: T, sources: Few<Partial<T>>): T {
  return assignFieldsWhen(fields, true, target, sources);
}

export function assignWhen<T extends object>(filter: VK<T, boolean> | true, target: T, sources: Few<Partial<T>>): T {
  return assignFieldsWhen(true, filter, target, sources);
}

export function assign<T extends object>(target: T, ...sources: Partial<T>[]): T {
  return assignFieldsWhen(true, true, target, sources);
}

// Sane type conversion
export function boolean(v: unknown, d?: boolean | null | undefined): boolean | null | undefined {
  return v == null || v === '' ?
    defined(d, Defined(v) ? null : undefined) :
    notnull(Bool(v, true), d, null);
}

export function number(v: unknown, d?: number | null | undefined): number | null | undefined {
  return v == null || v === '' ?
    defined(d, Defined(v) ? null : undefined) :
    (isNaN(v as number) ? defined(d, null) : +(v as any));
}

export function string(v: unknown, d?: string | null | undefined): string | null | undefined {
  return v == null ?
    defined(d, v) as string | null :
    "" + v;
}

// Merge keyed object arrays
type PossibleKeys<T> = { [K in keyof T]: T[K] extends string | number ? K : never }[keyof T];

export function mergeByKeyWhen
  <T extends object>(
    filter: VK<T, boolean> | true,
    mergeKey: PossibleKeys<T> | ((o: T) => string | number),
    ...sources: T[][]): T[] {
  const m: { [id: string /* T[K] */]: T } = {};
  for (const source of sources) {
    for (const item of source) {
      const key = (typeof mergeKey === 'function') ? mergeKey(item) : item[mergeKey];
      if (key != null) {
        m[key as any] = assignWhen(filter, m[key as any] || ({} as T), item);
      }
    }
  }
  return Object.keys(m).map((k) => m[k]);
}

export function mergeByKey
  <T extends object>(
    mergeKey: PossibleKeys<T> | ((o: T) => string | number),
    ...sources: T[][]): T[] {
  return mergeByKeyWhen(true, mergeKey, ...sources);
}

export function uniqueKey<T extends object>(f: (o: T) => string | number | null | undefined) {
  const r = Math.random().toFixed(5);
  let u = 0;

  return (o: T) => {
    const k = f(o);
    return k != null ? k : `__u_${r}_${++u}`;
  };
}
