[![Build Status](https://travis-ci.org/alexdrel/sigil.ts.svg?branch=master)](https://travis-ci.org/alexdrel/sigil.ts)

sigil.ts
===
Minimalistic typescript object manipulation library.

### Coalesce operators

```javascript
  notnull(null, undefined, 3) === 3
  defined(undefined, null) === null
```

### Type conversion operators
Especially suited for parsing size optimized or sloppy JSON
```javascript
  number('4') === 4
  boolean(1) === true
  boolean('0') === false
  string(4) === '4'
```

### Predicates
Empty means falsy :)

```javascript
  Truly([]) === false
  Truly({}) === false
  Truly('0') === false
  Defined(undefined) === false
  NotNull(undefined) === false
```

### object forEach and assign
```javascript

  assignWhen(Truly, { a: null, b: 3} , { a: [ 4 ], b: null, c: []})
  // { a: [4], b: 3}

  assignFields(['a','c'], { a: null, b: 3} , { a: [ 4 ], b: 1000, c: []})
  // { a: [4], b: 3, c: []}
  // Fields are compile-time checked to belong in the target
 
  // usefull for assign default values 
  assignWhen(NotIn, { b: 3} , { a: [ 4 ], b: 44, c: []})
  // { a: [4], b: 3, c: []}

  let to  = { a: 2, b: 2, c: 0 };
  forEach( (v, k) => {
      to[k] = notnull(to[k], 0) + v;
    }, { b: 1, c: 4 });
  // to: { a: 2, b: 3, c: 4}
```

### Reference
```javascript
// Coalesce
function notnull<T>(v: T, v1: T, v2?: T): T;
function defined<T>(v: T, v1: T, v2?: T): T;

// Predicates
function NotNull(v: any): boolean;
function Defined(v: any): boolean;
// empty array and propertyless object considered falsy
function Truly(v: any): boolean;

// field is null/undefined/not present in the target obejct
function HostNull<T>(_v: any, key: keyof T, target: T): boolean;
function HostUndefined<T>(_v: any, key: keyof T, target: T): boolean;
function NotIn<T>(_v: any, key: keyof T, target: T): boolean;

// forEach own propertry of an object
function forEach<T extends object>(func: (v: any, k: keyof T) => void, source: T): void;

// conditionally assing propertries of sources to target
function assignWhen<T extends object>(
  filter: (v: any, k: keyof T, target: T) => boolean,
  target: T,
  sources: Partial<T> | Partial<T>[]
): T;

// assign only listed fiedls
function assignFields<T extends object>(fields: (keyof T)[], target, sources): T;

// predicate and field list
function assignFieldsWhen<T extends object>(fields, filter, target, sources): T;

// classical assign
function assign<T extends object>(target: T, ...sources: Partial<T>[]): T;

// Type conversion/guessing
function boolean(v: any, d?: boolean): boolean;
function number(v: any, d?: number): number;
function string(v: any, d?: string): string;
```

## Usage
Npm compatible packager (browserify/webpack) is required.

## Development
#### Commands
* Watch commonJS build:  ```$ npm start```
* Build commonJS version:  ```$ npm run build```
* Run tests (Firefox): ```$ npm test```
* Watch tests (Chrome): ```$ npm run test:watch```

