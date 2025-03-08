import type { R, Unique } from "./utils";
import type { NeverMarked, FalseMarked, Marked } from "./interface";
import type { INCLUDE_T } from "./config";

type IsError<T> = T extends null
  ? false
  : [T] extends [NeverMarked | FalseMarked]
  ? true
  : false;
type IsNever<T> = T extends null ? false : T extends NeverMarked ? true : false;
type IsFalse<T> = T extends null ? false : T extends FalseMarked ? true : false;

type WithT<E, T> = E extends { M: infer M extends string[] }
  ? INCLUDE_T extends true
    ? IsNever<E> extends true
      ? { _NEVER: 1; M: M; T: T }
      : { _FALSE: 1; M: M; T: T }
    : IsNever<E> extends true
    ? { _NEVER: 1; M: M }
    : { _FALSE: 1; M: M }
  : never;

type PrintNever<T, M extends string[]> = R<WithT<{ _NEVER: 1; M: M }, T>>;
type PrintFalse<T, M extends string[]> = R<WithT<{ _FALSE: 1; M: M }, T>>;

type Print<
  T,
  M extends string[],
  Never extends boolean = false
> = Never extends true ? PrintNever<T, M> : PrintFalse<T, M>;

type Add<
  Err extends Marked,
  ExistingT extends any,
  Msgs extends string[],
  NewMsgs extends string[],
  Never extends boolean
> = Err extends NeverMarked
  ? Never extends true
    ? PrintNever<ExistingT, [...Msgs, ...NewMsgs]>
    : PrintFalse<ExistingT, [...NewMsgs]>
  : Never extends true
  ? PrintFalse<ExistingT, [...Msgs]>
  : PrintFalse<ExistingT, [...Msgs, ...NewMsgs]>;
type AddError<
  Err extends any,
  Msgs extends string[],
  Never extends boolean = false,
  T extends any = null
> = Err extends null
  ? Print<T, Msgs, Never>
  : Err extends {
      M: infer OldMsgs extends string[];
    }
  ? Err extends { T: infer ExistingT }
    ? Add<Err, ExistingT, OldMsgs, Msgs, Never>
    : Add<Err, null, OldMsgs, Msgs, Never>
  : PrintNever<Err, ["Could not parse error"]>;

type MergeWMessages<
  A extends { M: any[]; T?: any },
  B extends { M: any[]; T?: any },
  Never extends boolean
> = Print<A["T"] | B["T"], Unique<[...A["M"], ...B["M"]]>, Never>;
type MergeWOMessages<
  A extends { M: any[]; T?: any },
  B extends { T?: any },
  Never extends boolean
> = Print<A["T"] | B["T"], A["M"], Never>;

type MergeVal<Val1, Val2> = Val2 extends Marked
  ? Val1 extends Marked
    ? MergeError<Val1, Val2>
    : Val2
  : Val1;

type MergeError<Err1 extends Marked, Err2 extends Marked> = {
  1: IsFalse<Err1>;
  2: IsFalse<Err2>;
} extends { 1: true; 2: true }
  ? MergeWMessages<Err1, Err2, false>
  : { 1: IsFalse<Err1>; 2: IsFalse<Err2> } extends { 1: true; 2: false }
  ? MergeWOMessages<Err1, Err2, false>
  : { 1: IsFalse<Err1>; 2: IsFalse<Err2> } extends { 1: false; 2: true }
  ? MergeWOMessages<Err2, Err1, false>
  : MergeWMessages<Err1, Err2, true>;

export type {
  IsError,
  IsNever,
  IsFalse,
  PrintFalse,
  PrintNever,
  Print,
  AddError,
  MergeVal,
  MergeError,
};
