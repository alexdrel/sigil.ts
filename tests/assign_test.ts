import { assign, assignFields, assignFieldsWhen, assignWhen, HostNull, HostUndefined, NotIn } from "../src/sigil";
import { boolean, forEach, notnull, NotNull, number, string, Truly } from "../src/sigil";

interface ABc {
  a: null | number | number[] | { a?: number };
  b: null | number;
  c?: null | number | number[] | { a?: number };
}

describe("conditional assign", () => {
  it("basic assign", () => {
    expect(assign({ a: null, b: 3 } as ABc, { a: null, b: 6, c: 3 })).toEqual({ a: null, b: 6, c: 3 });
    expect(assignWhen(true, { a: null, b: 3 } as ABc, { a: null, b: 6, c: 3 })).toEqual({ a: null, b: 6, c: 3 });
  });

  it("assign last not null", () => {
    expect(assignWhen(NotNull, { a: null, b: 3 } as ABc, { a: 4, b: null, c: null })).toEqual({ a: 4, b: 3 });
    expect(assignWhen(NotNull, { a: null, b: 3 } as ABc, { a: null, b: 6, c: 3 })).toEqual({ a: null, b: 6, c: 3 });
    expect(assignWhen(NotNull, { a: null, b: 3 } as ABc,
      [{ a: null, b: null, c: 3 },
      { a: 1, b: 6 }, { a: 2, b: undefined, c: 4 }]))
      .toEqual({ a: 2, b: 6, c: 4 });
  });

  it("assign truly", () => {
    expect(assignWhen(Truly, { a: null, b: 3 } as ABc, { a: [4], b: null, c: [] })).toEqual({ a: [4], b: 3 });
    expect(assignWhen(Truly, { a: null, b: 3 } as ABc, { a: { a: 4 }, b: 6, c: {} })).toEqual({ a: { a: 4 }, b: 6 });
    expect(assignWhen(Truly, { a: null, b: 3 } as ABc,
      [{ a: null, b: null, c: 3 },
      { a: 1, b: 6 }, { a: 2, b: undefined, c: 4 }]))
      .toEqual({ a: 2, b: 6, c: 4 });
  });

  it("pick fields", () => {
    let source = { a: null, c: 4, b: 5 } as ABc;
    expect(assignFields(["a", "c"], { a: 2, b: 3 } as ABc, source))
      .toEqual({ a: null, b: 3, c: 4 });
    expect(assignFieldsWhen(["a", "c"], NotNull, { a: 2, b: 3 } as ABc, source))
      .toEqual({ a: 2, b: 3, c: 4 });
  });

  it("throw on null target", () => {
    expect(() => assign(null as unknown as object, {})).toThrow();
  });
});

interface Types {
  b: boolean | null;
  n: number | null;
  n1?: number | null;
  s?: string | null;
}

describe("assign/transform", () => {
  it("assign transform", () => {
    let tp: Types = { b: true, n: null, s: "str" };
    let ov = { vb: 1, vn: "10", vs: undefined as unknown as string };

    assignWhen(NotNull, tp, [{
      b: boolean(ov.vb),
      n: +(ov.vn),
      s: (ov.vs),
    }, {
      b: boolean(null),
      n: number("x"),
      s: string(undefined),
    }]);
    expect(tp).toEqual({ b: true, n: 10, s: "str" });
  });

  it("assign defaults - nulls", () => {
    let tp: Types = { b: true, n: null, s: undefined };

    assignWhen(HostNull, tp, { b: false, n: 10, n1: 11, s: "str" });
    expect(tp).toEqual({ b: true, n: 10, n1: 11, s: "str" });
  });

  it("assign defaults - undefined", () => {
    let tp: Types = { b: true, n: null, s: undefined };

    assignWhen(HostUndefined, tp, { b: false, n: 10, n1: 11, s: "str" });
    expect(tp).toEqual({ b: true, n: null, n1: 11, s: "str" });
  });

  it("assign defaults - not in", () => {
    let tp: Types = { b: true, n: null, s: undefined };

    assignWhen(NotIn, tp, { b: false, n: 10, n1: 11, s: "str" });
    expect(tp).toEqual({ b: true, n: null, n1: 11, s: undefined });
  });

  it("forEach type", () => {
    const x: { [k: number]: string } = {};
    forEach((v, k) => {
      v.toLocaleLowerCase();
      k.toFixed();
    }, x);

    const xx: { [k: string]: number } = {};
    let a: keyof typeof xx; // a is (string | number) in TS 3.1, not string as expected
    forEach((v, _k) => {
      // k.toLocaleLowerCase();
      v.toFixed();
    }, xx);
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

    forEach((v: any, k) => {
      if (k === 'p') {
        to.p = v.split(',').map(number);
      } else if (v === $inc) {
        (to as any)[k]++;
      } else if (v === $delete) {
        delete to[k];
      }
    }, {
        eliminate: $delete,
        p: "1234,5678,9012",
        a: $inc,
      });
    expect(to).toEqual({ a: 3, p: [1234, 5678, 9012] });
  });

  it("sum", () => {
    let to: ABc = {
      a: 2,
      b: 2,
    };

    forEach((v, k) => {
      to[k] = notnull((to as any)[k] , 0) + v;
    }, {
        b: 1,
        c: 4,
      });
    expect(to).toEqual({ a: 2, b: 3, c: 4 });
  });

});
