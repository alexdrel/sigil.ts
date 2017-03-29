import { assign, assignFields, assignFieldsWhen, assignWhen } from "../src/sigil";
import { boolean, forEach, notnull, NotNull, number, string, Truly } from "../src/sigil";

interface ABc {
   a: number | number[] | { a?: number };
   b: number;
   c?: number | number[] | { a?: number };
};

describe("conditional assign", () => {
  it("basic assign", () => {
    expect(assign({ a: null, b: 3} as ABc, { a: null, b: 6, c: 3})).toEqual({ a: null, b: 6, c: 3});
    expect(assignWhen(true, { a: null, b: 3} as ABc, { a: null, b: 6, c: 3})).toEqual({ a: null, b: 6, c: 3});
  });

  it("assign last not null", () => {
    expect(assignWhen(NotNull, { a: null, b: 3} as ABc, { a: 4, b: null, c: null})).toEqual({ a: 4, b: 3});
    expect(assignWhen(NotNull, { a: null, b: 3} as ABc, { a: null, b: 6, c: 3})).toEqual({ a: null, b: 6, c: 3});
    expect(assignWhen(NotNull, { a: null, b: 3} as ABc,
      [{ a: null, b: null, c: 3},
      { a: 1 , b: 6 }, { a: 2, b: undefined, c: 4}]))
      .toEqual({ a: 2, b: 6, c: 4});
  });

  it("assign truly", () => {
    expect(assignWhen(Truly, { a: null, b: 3} as ABc, { a: [ 4 ], b: null, c: []})).toEqual({ a: [4], b: 3});
    expect(assignWhen(Truly, { a: null, b: 3} as ABc, { a: { a: 4}, b: 6, c: {}})).toEqual({ a: { a: 4}, b: 6});
    expect(assignWhen(Truly, { a: null, b: 3} as ABc,
      [{ a: null, b: null, c: 3},
      { a: 1 , b: 6 }, { a: 2, b: undefined, c: 4}]))
      .toEqual({ a: 2, b: 6, c: 4});
  });

  it("pick fields", () => {
    let source = { a: null, c: 4, b: 5} as ABc;
    expect(assignFields(["a", "c"], { a: 2, b: 3} as ABc, source))
      .toEqual({ a: null, b: 3, c: 4});
    expect(assignFieldsWhen(["a", "c"], NotNull, { a: 2, b: 3} as ABc, source))
      .toEqual({ a: 2, b: 3, c: 4});
  });

});

interface Types {
  b: boolean;
  n: number;
  s: string;
}

describe("assign/transform", () => {
  it("assign transform", () => {
    let tp: Types = { b: true, n: null, s: "str" };
    let ov = { vb: 1, vn: "10", vs: undefined as string };

    assignWhen(NotNull, tp, [{
      b: boolean(ov.vb),
      n: +(ov.vn),
      s: (ov.vs),
    }, {
      b: boolean(null),
      n: number("x"),
      s: string(undefined),
    }]);
    expect(tp).toEqual({ b: true, n: 10 , s: "str"});
  });

  it("forEach transform", () => {
    const $delete = {};
    const $inc = {};

    let to: {
      eliminate?: number,
      a: number,
      p?: number[],
    } = {
      eliminate: 5,
      a: 2,
    };

    forEach( (v, k) => {
      if (k === 'p') {
        to.p = v.split(',').map(number);
      } else if (v === $inc) {
        to[k]++;
      } else if (v === $delete) {
        delete to[k];
      }
    }, {
      eliminate: $delete,
      p: "1234,5678,9012",
      a: $inc,
    });
    expect(to).toEqual({ a: 3, p: [1234, 5678, 9012]});
  });

  it("sum", () => {
    let to: ABc = {
      a: 2,
      b: 2,
    };

    forEach( (v, k) => {
      to[k] = notnull(to[k], 0) + v;
    }, {
      b: 1,
      c: 4,
    });
    expect(to).toEqual({ a: 2, b: 3, c: 4});
  });

});
