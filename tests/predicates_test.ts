import { defined, Defined, notnull, NotNull, Truly } from "../src/sigil";

describe("coalesce", () => {
  it("finds first not null", () => {
    let a: number = null;
    expect(notnull(a, 2)).toBe(2);
    expect(notnull(3, 2)).toBe(3);
    expect(notnull(null, undefined, 3)).toBe(3);
    expect(notnull(a, undefined, +("3"))).toBe(3);
  });

  it("finds first defined", () => {
    let a: number = null;
    expect(defined(a, 2)).toBe(null);
    expect(defined(3, 2)).toBe(3);
    expect(defined(undefined, undefined, 3)).toBe(3);
    expect(defined(undefined, a, +("3"))).toBe(null);
  });
});

describe("predicates", () => {
  it("truly are", () => {
    expect(Truly({a: 1})).toBe(true);
    expect(Truly({a: false})).toBe(true);
    expect(Truly({})).toBe(false);
    expect(Truly([0])).toBe(true);
    expect(Truly([])).toBe(false);
    expect(Truly(1)).toBe(true);
    expect(Truly(null)).toBe(false);
    expect(Truly(undefined)).toBe(false);
    expect(Truly(0)).toBe(false);
    expect(Truly('')).toBe(false);
    expect(Truly('0')).toBe(false);
  });

  it("NotNull are", () => {
    expect(NotNull({a: 1})).toBe(true);
    expect(NotNull(1)).toBe(true);
    expect(NotNull({})).toBe(true);
    expect(NotNull(null)).toBe(false);
    expect(NotNull(undefined)).toBe(false);
    expect(NotNull(0)).toBe(true);
    expect(NotNull('')).toBe(true);
    expect(NotNull('0')).toBe(true);
  });

  it("Defined are", () => {
    expect(Defined({a: 1})).toBe(true);
    expect(Defined(1)).toBe(true);
    expect(Defined({})).toBe(true);
    expect(Defined(null)).toBe(true);
    expect(Defined(undefined)).toBe(false);
    expect(Defined(0)).toBe(true);
    expect(Defined('')).toBe(true);
    expect(Defined('0')).toBe(true);
  });
});
