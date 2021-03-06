import { boolean, number, string } from "../src/sigil";

describe("type conversion", () => {
  it("boolean", () => {
    expect(boolean(null)).toBeNull();
    expect(boolean(undefined)).toBeUndefined();
    expect(boolean(0)).toBe(false);
    expect(boolean(1)).toBe(true);
    expect(boolean('')).toBeNull();
    expect(boolean('0')).toBe(false);
    expect(boolean('1')).toBe(true);
    expect(boolean('zz')).toBe(null);
    expect(boolean('true')).toBe(true);
    expect(boolean('false')).toBe(false);
    expect(boolean('TRUE')).toBe(true);
    expect(boolean('FALSE')).toBe(false);
    expect(boolean([])).toBe(false);
    expect(boolean([0])).toBe(true);
    expect(boolean({})).toBe(false);
    expect(boolean({ a: 0 })).toBe(true);
  });

  it("boolean, default", () => {
    expect(boolean(undefined, undefined)).toBeUndefined();
    expect(boolean(undefined, null)).toBeNull();
    expect(boolean(undefined, false)).toBe(false);
    expect(boolean(undefined, true)).toBe(true);

    expect(boolean(null, undefined)).toBeNull();
    expect(boolean(null, null)).toBeNull();
    expect(boolean(null, false)).toBe(false);
    expect(boolean('', true)).toBe(true);
    expect(boolean(0, true)).toBe(false);
    expect(boolean(1, false)).toBe(true);
    expect(boolean('zz', false)).toBe(false);
  });

  it("number", () => {
    expect(number(undefined, undefined)).toBeUndefined();
    expect(number(null)).toBeNull();
    expect(number(undefined, null)).toBeNull();
    expect(number('')).toBeNull();
    expect(number('', 100)).toBe(100);
    expect(number(0)).toBe(0);
    expect(number(1)).toBe(1);
    expect(number('0')).toBe(0);
    expect(number('1')).toBe(1);
    expect(number('zz')).toBeNull();
    expect(number('zz', 100)).toBe(100);
  });

  it("string", () => {
    expect(string(null)).toBeNull();
    expect(string(undefined)).toBeUndefined();
    expect(string(0)).toBe('0');
    expect(string('0')).toBe('0');
  });
});
