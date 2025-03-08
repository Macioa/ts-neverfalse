import { expectType } from "tsd";
import { NEVER, FALSE, VALIDATE_ALL } from "../src/index";

describe("NEVER", () => {
  it("should create 'never' errors", () => {
    type R0 = NEVER<"TEST", "my msg">;
    expectType<{
      _NEVER: 1;
      M: ["my msg"];
      T: "TEST";
    }>({} as R0);
  });
  it("should concat 'never' errors", () => {
    type R0 = NEVER<1, "my msg 1">;
    type R1 = NEVER<R0, "my msg 2">;
    expectType<{
      _NEVER: 1;
      M: ["my msg 1", "my msg 2"];
      T: 1;
    }>({} as R1);
  });
});

describe("FALSE", () => {
  it("should create 'false' errors", () => {
    type R0 = FALSE<{}, "my msg">;
    expectType<{
      _FALSE: 1;
      M: ["my msg"];
      T: {};
    }>({} as R0);
  });
  it("should concat 'false' errors", () => {
    type R0 = FALSE<{}, "my msg 1">;
    type R1 = FALSE<R0, "my msg 2">;
    expectType<{
      _FALSE: 1;
      M: ["my msg 1", "my msg 2"];
      T: {};
    }>({} as R1);
  });
  it("should override 'never' errors", () => {
    type R0 = NEVER<1, "nvr msg 1">;
    type R1 = NEVER<R0, "nvr msg 2">;
    // expect NEVER with concatenated never messages
    expectType<{
      _NEVER: 1;
      M: ["nvr msg 1", "nvr msg 2"];
      T: 1;
    }>({} as R1);

    type R2 = FALSE<R1, "fls msg 3">;
    type R3 = FALSE<R2, "fls msg 4">;

    // expect FALSE with concatenated false messages (never msgs discarded)
    expectType<{
      _FALSE: 1;
      M: ["fls msg 3", "fls msg 4"];
      T: 1;
    }>({} as R3);

    type R4 = NEVER<R3, "nvr msg 5">;

    // expect FALSE with concatenated false messages (never msgs discarded)
    expectType<{
      _FALSE: 1;
      M: ["fls msg 3", "fls msg 4"];
      T: 1;
    }>({} as R4);
  });
});

describe("VALIDATE_ALL", () => {
  it("concats multiple validations", () => {
    type Val1stAnd3rdArgs<T extends any[]> = T extends [
      infer A,
      infer _B,
      infer C,
      ...infer _R
    ]
      ? A extends C
        ? T
        : FALSE<T, "1st and 3rd args must be equal">
      : FALSE<T, "Expected at least 3 args">;
    type Val2ndArgIsString<T extends any[]> = T extends [
      infer _A,
      infer B,
      ...infer _R
    ]
      ? B extends string
        ? T
        : FALSE<T, "2nd arg must be a string">
      : FALSE<T, "Expected at least 2 args">;
    type ValidateTuple<T extends any[]> = VALIDATE_ALL<
      [Val1stAnd3rdArgs<T>, Val2ndArgIsString<T>]
    >;

    // valid cases
    type R01 = Val1stAnd3rdArgs<[1, "2", 1]>;
    expectType<[1, "2", 1]>({} as R01);
    type R02 = Val2ndArgIsString<[1, "2", 1]>;
    expectType<[1, "2", 1]>({} as R02);
    type R00 = ValidateTuple<[1, "2", 1]>;
    expectType<[1, "2", 1]>({} as R00);

    // error cases
    type R11 = Val1stAnd3rdArgs<[1, 1, "3"]>;
    expectType<{
      _FALSE: 1;
      M: ["1st and 3rd args must be equal"];
      T: [1, 1, "3"];
    }>({} as R11);
    type R12 = Val2ndArgIsString<[1, 1, "3"]>;
    expectType<{
      _FALSE: 1;
      M: ["2nd arg must be a string"];
      T: [1, 1, "3"];
    }>({} as R12);
    type R10 = ValidateTuple<[1, 1, "3"]>;
    expectType<{
      _FALSE: 1;
      M: ["1st and 3rd args must be equal", "2nd arg must be a string"];
      T: [1, 1, "3"];
    }>({} as R10);
  });
});

describe("Workflow Test", () => {
  it("allows custom validations and arg errors", () => {
    type Val1_2Args<T extends readonly unknown[]> = T extends readonly [
      infer V1,
      infer V2,
      ...infer _R
    ]
      ? V1 extends V2
        ? T
        : FALSE<T, "1st and 2nd args must be equal">
      : FALSE<T, "Expected at least 2 args">;

    type Val3rdArg<T extends readonly unknown[]> = T extends readonly [
      infer _V1,
      infer _V2,
      infer V3
    ]
      ? V3 extends (p: infer Arg) => infer Return
        ? Arg extends Return
          ? T
          : FALSE<T, "Input type must match return type on 3rd Arg">
        : FALSE<T, "3rd arg must be a function">
      : FALSE<T, "Must have 3 arguments">;

    type EvalFnParams<T extends ReadonlyArray<readonly unknown[]>> = {
      [K in keyof T]: VALIDATE_ALL<[Val1_2Args<T[K]>, Val3rdArg<T[K]>]>;
    };
    const myFunc = <T extends any[]>(...args: [...EvalFnParams<T>]) => null;

    myFunc(
      [1, 1, (p: number) => 1] as const,
      ["a", "a", (p: string) => ""] as const
    );

    myFunc(
      [1, 1, (p: number) => 1] as const,
      //@ts-expect-error
      [1, 2, (p: number) => ""] as const
    );
  });
});
