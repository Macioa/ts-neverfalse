import { expectType } from "tsd";
import { Print } from "../src/error";
import { INCLUDE_T, includeT } from "../src/config";

declare global {
  namespace NeverFalse {
    interface Config {
      includeT: true;
    }
  }
}
describe("INCLUDE_T", () => {
  it("should take setting from global declaration", () => {
    expectType<true>({} as INCLUDE_T);
  });
  it("should default to 'false'", () => {
    expectType<false>({} as includeT<{}>);
  });
  it("should include T in errors when enabled", () => {
    type R = Print<"Hello", ["msg"], false>;
    expectType<{
      _FALSE: 1;
      M: ["msg"];
      T: "Hello";
    }>({} as R);
  });
});

export {};
