import { mergeByKey, mergeByKeyWhen, NotIn, uniqueKey } from "../src/sigil";
import { NotNull, Truly } from "../src/sigil";

interface Item {
  id: string | number;
  a?: null | number;
  b?: null | number | number[] | { a?: number };
  c?: string;
  o?: object;
}

describe("array merge", () => {
  const a1: Item[] = [{ id: 1, a: 1 }, { id: 2, b: { a: 2 }, c: "2" }, { id: 3 }];
  const a2 = [{ id: 1, b: 1 }, { id: 2, a: 2 }, { id: 4, a: 4 }];

  it("basic merge", () => {
    expect(mergeByKey('id', a1, a2)).toEqual([
      { id: 1, a: 1, b: 1 }, { id: 2, a: 2, b: { a: 2 }, c: "2" }, { id: 3 }, { id: 4, a: 4 },
    ]);
    expect(mergeByKey('id', [{ id: 1, a: 1 }], [{ id: 1, a: null }])).toEqual(
      [{ id: 1, a: null }]);
    expect(mergeByKeyWhen(NotNull, 'id', [{ id: 1, a: 1 }], [{ id: 1, a: null }])).toEqual(
      [{ id: 1, a: 1 }]);
    // Weird compliation error due to NotIn in karma only
    // expect(mergeByKeyWhen(NotIn, 'id', [{ id: 1, a: 1 }], [{ id: 1, a: 2 }])).toEqual(
    //   [{ id: 1, a: 1 }]);
    expect(mergeByKeyWhen(Truly, 'id', [{ id: 1, a: 1 }], [{ id: 1, a: 0 }])).toEqual(
      [{ id: 1, a: 1 }]);
  });

  it("absent key merge", () => {
    expect(mergeByKey(uniqueKey((v) => v.a), a1, a2)).toEqual([
      { id: 1, a: 1 }, { id: 2, a: 2 }, { id: 4, a: 4 }, { id: 2, b: { a: 2 }, c: "2" }, { id: 3 }, { id: 1, b: 1 },
    ]);
    expect(mergeByKey((v) => v.a || '', a1, a2)).toEqual([
      { id: 1, a: 1 }, { id: 2, a: 2 }, { id: 4, a: 4 }, { id: 1, b: 1, c: "2" },
    ]);
  });
});
