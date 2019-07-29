import { boolean, copyWithSchema, number, Schema, string, withDefault } from "../src/sigil";

describe("schema", () => {
  const schema = {
    root: {
      name: string,
      list: [{
        b: boolean,
        key: number,
        v: string,
        ['']: "key" as any,
      }],
    },
    opt: [number],
  };

  it("copy", () => {
    const obj = copyWithSchema(schema,
      {
        root: {
          name: "Name",
          list: [
            { key: "1", b: 0, v: "v1" },
            { key: 2, v: "v2", x: 0 },
            { key: 3, b: false, v: "v3", y: [{}] },
          ],
        },
      },
    );

    expect(obj.root.list.length).toEqual(3);
    expect(obj).toEqual({
      root: {
        name: "Name",
        list: [
          { key: 1, b: false, v: "v1" },
          { key: 2, v: "v2" },
          { key: 3, b: false, v: "v3" },
        ],
      },
    } as typeof obj);
  });

  it("elemental array mismatch", () => {
    const obj = copyWithSchema(schema,
      {
        opt: 3,
      },
    );

    expect(obj).toEqual({
      opt: [3],
    } as typeof obj);
  });

  it("structured array mismatch", () => {
    const obj = copyWithSchema(schema,
      {
        root: {
          list: { key: "1", b: 0, v: "v1" },
        },
      },
    );

    expect(obj).toEqual({
      root: {
        list: [
          { key: 1, b: false, v: "v1" },
        ],
      },
    } as typeof obj);
  });

  it("structured default", () => {
    const obj = copyWithSchema(schema,
      {
        root: "Name",
      },
    );

    expect(obj).toEqual({
      root: {
        name: "Name",
      },
    } as typeof obj);
  });

  it("structured array named default field", () => {
    const obj = copyWithSchema(schema,
      {
        root: {
          list: [1],
        },
      },
    );
    expect(obj).toEqual({
      root: {
        list: [
          { key: 1 },
        ],
      },
    } as typeof obj);

    const obj1 = copyWithSchema(schema,
      {
        root: {
          list: 1,
        },
      },
    );
    expect(obj1).toEqual({
      root: {
        list: [
          { key: 1 },
        ],
      },
    } as typeof obj1);
  });
});

describe("schema defaults", () => {
  const schema = [{
    name: string,
    c: withDefault(number, 3),
  }];

  it("array", () => {
    const obj = copyWithSchema(schema, "T0" as any);
    expect(obj).toEqual([{
      name: "T0",
      c: 3,
    }] as typeof obj);
  });

  it("empty array", () => {
    const obj = copyWithSchema({ arr: [number, 0] }, {} as any);
    expect(obj).toEqual({ arr: [] } as typeof obj);
  });

  it("non-empty array", () => {
    const obj = copyWithSchema({ arr: [number, 0] }, { arr: [1] } as any);
    expect(obj).toEqual({ arr: [1] } as typeof obj);
  });
});

interface Content {
  video?: {
    url: string;
    title?: string;
    start: number;
  }[];
  image?: {
    url?: string;
    position?: string;
  };
  controls?: boolean;
  order?: number[];
}

const ContentSchema: Schema<Content> = {
  video: [{
    url: string,
    title: string,
    start: withDefault(number, 0),
  }],
  image: {
    url: string,
    position: withDefault(string, "center"),
  },
  controls: boolean,
  order: [number],
};

describe("content schema ", () => {
  it("minimal", () => {
    const obj = copyWithSchema(ContentSchema, "url0" as any);
    expect(obj).toEqual({
      video: [{ url: "url0", start: 0 }],
    });
  });

  it("image", () => {
    const obj = copyWithSchema(ContentSchema, { image: "url0" });
    expect(obj).toEqual({
      image: { url: "url0", position: "center" },
    });
  });

  it("both", () => {
    const obj = copyWithSchema(ContentSchema, {
      video: "url0",
      image: { url: "url1", position: "stretch" },
      controls: "0",
      order: "1",
      junk: {
        whatever: [],
      },
    });
    expect(obj).toEqual({
      video: [{ url: "url0", start: 0 }],
      image: { url: "url1", position: "stretch" },
      controls: false,
      order: [1],
    });
  });

  it("promote array", () => {
    const obj = copyWithSchema(ContentSchema, ["url0", "url1"] as any);
    expect(obj).toEqual({
      video: [
        { url: "url0", start: 0 },
        { url: "url1", start: 0 },
      ],
    });
  });
});
