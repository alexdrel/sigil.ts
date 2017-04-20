// coalesce
export function notnull<T>(v: T, v1: T, v2?: T): T {
  return (v != null ? v : (v1 != null ? v1 : v2));
}

export function defined<T>(v: T, v1: T, v2?: T): T {
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

// object forEach and (un-)conditional assign
export type VK<T, R> = (v: any, k: keyof T) => R;
export type Few<T> = T | T[];

export type Partial<T> = {
  // tslint:disable-next-line:semicolon
  [P in keyof T]?: T[P];
};

export function forEach<T extends object>(func: VK<T, void>, source: T): void {
  if (source != null) {
    for (let key in source) {
      if (Object.prototype.hasOwnProperty.call(source, key)) {
        func(source[key], key);
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
  if (target && filter == null) {
    throw new TypeError("Cannot convert undefined or null to object");
  }
  let to = Object(target);
  let sources = sourceS instanceof Array ? sourceS : [sourceS];
  for (let index = 0; index < sources.length; index++) {
    forEach((v, k) => {
      if ((filter === true || filter(v, k)) &&
        (fields === true || fields.indexOf(k) >= 0)) {
        to[k] = v;
      }
    }, sources[index]);
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
export function boolean(v: any, d?: boolean): boolean {
  return v == null || v === '' ?
    defined(d, Defined(v) ? null : undefined) :
    notnull(Bool(v, true), d, null);
}

export function number(v: any, d?: number): number {
  return v == null || v === '' ?
    defined(d, Defined(v) ? null : undefined) :
    (isNaN(v) ? defined(d, null) : +v);
}

export function string(v: any, d?: string): string {
  return v == null ?
    defined(d, v) :
    "" + v;
}
