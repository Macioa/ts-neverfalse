import { expectType } from "tsd";
import {
  IsError,
  IsFalse,
  IsNever,
  MergeVal,
  Print,
} from "../src/error";

describe("Print", () => {
  it("should create 'false' errors", () => {
    type R0 = Print<null, ["msg"], false>;
    expectType<{
      _FALSE: 1;
      M: ["msg"];
      T?: null;
    }>({} as R0);
  });
  it("should create 'never' errors", () => {
    type R0 = Print<null, ["msg"], true>;
    expectType<{
      _NEVER: 1;
      M: ["msg"];
      T?: null;
    }>({} as R0);
  });
});

describe("IsError", () => {
  it("should detect errors", () => {
    type R0 = IsError<null>;
    expectType<false>({} as R0);
    type R1 = IsError<{ M: string[] }>;
    expectType<false>({} as R1);
    type R2 = IsError<Print<null, ["msg"], false>>;
    expectType<true>({} as R2);
    type R3 = IsError<Print<null, ["msg"], true>>;
    expectType<true>({} as R3);
  });
});

describe("IsFalse", () => {
  it("should not detect 'never' errors", () => {
    type R0 = IsFalse<null>;
    expectType<false>({} as R0);
    type R1 = IsFalse<{ M: string[] }>;
    expectType<false>({} as R1);
    type R2 = IsFalse<Print<null, ["msg"], false>>;
    expectType<true>({} as R2);
    type R3 = IsFalse<Print<null, ["msg"], true>>;
    expectType<false>({} as R3);
  });
});

describe("IsNever", () => {
  it("should not detect 'false' errors", () => {
    type R0 = IsNever<null>;
    expectType<false>({} as R0);
    type R1 = IsNever<{ M: string[] }>;
    expectType<false>({} as R1);
    type R2 = IsNever<Print<null, ["msg"], false>>;
    expectType<false>({} as R2);
    type R3 = IsNever<Print<null, ["msg"], true>>;
    expectType<true>({} as R3);
  });
});

describe("MergeVal", () => {
  it("should coalesce 'false' errors over 'never' errors", () => {
    type R0 = MergeVal<null, null>;
    expectType<null>({} as unknown as  R0);
    type R1 = MergeVal<null, Print<null, ["msg"], false>>;
    expectType<{
      _FALSE: 1;
      M: ["msg"];
      T?: null;
    }>({} as R1);
    type R2 = MergeVal<Print<null, ["msg"], true>, null>;
    expectType<{
      _NEVER: 1;
      M: ["msg"];
      T?: null;
    }>({} as R2);
    type R3 = MergeVal<Print<null, ["msg"], true>, Print<null, ["msg"], false>>;
    expectType<{
      _FALSE: 1;
      M: [ "msg"];
      T?: null;
    }>({} as R3);
  });
  it("should coalesce errors over values", () => {
    type R0 = MergeVal<1, null>;
    expectType<1>({} as R0);
    type R1 = MergeVal<1, Print<null, ["msg"], false>>;
    expectType<{
      _FALSE: 1;
      M: ["msg"];
      T?: null;
    }>({} as R1);
    type R2 = MergeVal<Print<null, ["msg"], true>, 1>;
    expectType<{
      _NEVER: 1;
      M: ["msg"];
      T?: null;
    }>({} as R2);
    type R3 = MergeVal<1,1>;
    expectType<1>({} as R3);
  })
})