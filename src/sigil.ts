export type Opt<T> = T | null | undefined;

// coalesce
export function notnull<T>(v: T, v1: T, v2?: T): Opt<T> {
  return (v != null ? v : (v1 != null ? v1 : v2));
}

export function defined<T>(v: T, v1: T, v2?: T): Opt<T> {
  return (v !== undefined ? v : (v1 !== undefined ? v1 : v2));
}

export function maybe<T, R>(v: T | undefined | null, func: (vv: T) => R): Opt<R> {
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
export function boolean(v: unknown, d?: Opt<boolean>): Opt<boolean> {
  return v == null || v === '' ?
    defined(d, Defined(v) ? null : undefined) :
    notnull(Bool(v, true), d, null);
}

export function number(v: unknown, d?: Opt<number>): Opt<number> {
  return v == null || v === '' ?
    defined(d, Defined(v) ? null : undefined) :
    (isNaN(v as number) ? defined(d, null) : +(v as any));
}

export function string(v: unknown, d?: Opt<string>): Opt<string> {
  return v == null ?
    defined(d, v) as string | null :
    "" + v;
}

// Merge keyed object arrays
type PossibleKeys<T> = { [K in keyof T]: T[K] extends string | number ? K : never }[keyof T];
type OptKey = Opt<string | number>;
export function mergeByKeyWhen
  <T extends object>(
    filter: VK<T, boolean> | true,
    mergeKey: PossibleKeys<T> | ((o: T) => OptKey),
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
    mergeKey: PossibleKeys<T> | ((o: T) => OptKey),
    ...sources: T[][]): T[] {
  return mergeByKeyWhen(true, mergeKey, ...sources);
}

export function uniqueKey<T extends object>(f: (o: T) => OptKey) {
  const r = Math.random().toFixed(5);
  let u = 0;

  return (o: T) => {
    const k = f(o);
    return k != null ? k : `__u_${r}_${++u}`;
  };
}

export type Schema<T> = {
  [P in keyof T]: Schema<T[P]> | (T[P] extends object ? never : (v: any) => Opt<T[P]>);
};

export function copyWithSchema<T>(schema: Schema<T>, data: object): T {
  if (schema instanceof Function) {
    return schema(data);
  }

  if (Array.isArray(schema)) {
    if (Array.isArray(data)) {
      return data.map((e: any) => copyWithSchema(schema[0], e)) as any;
    } else {
      if (data === undefined) {
        return (schema.length > 1 ? [] : data) as any;
      } else {
        return [copyWithSchema(schema[0], data)] as any;
      }
    }
  }

  if (data == null) {
    return data as any;
  }

  if (Array.isArray(data) || !(data instanceof Object)) {
    const f: string = (schema as any)[''] || Object.keys(schema)[0];
    data = { [f]: copyWithSchema((schema as any)[f], data) };
  }

  const json: any = {};
  Object.keys(schema).forEach((k) => {
    const v = copyWithSchema((schema as any)[k], (data as any)[k]);
    if (v !== undefined) {
      json[k] = v;
    }
  });
  return json;
}

export function withDefault<T>(p: (v: any, d?: T | null) => Opt<T>, d: T | null) {
  return (v: any) => p(v, d);
}
