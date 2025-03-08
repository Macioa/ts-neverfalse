import { IsError, AddError, MergeVal, PrintFalse, PrintNever } from "./error";
import { Marked } from "./interface";

type NEVER<T, M extends string> = IsError<T> extends true
  ? T extends Marked
    ? AddError<T, [M], true>
    : PrintNever<T, [M]>
  : PrintNever<T, [M]>;

type FALSE<T, M extends string> = IsError<T> extends true
  ? T extends Marked
    ? AddError<T, [M], false>
    : PrintFalse<T, [M]>
  : PrintFalse<T, [M]>;

type VALIDATE_ALL<
  Validators extends any[],
  Err = null,
  T = null
> = Validators extends [infer F, ...infer R]
  ? {
      NewErr: MergeVal<Err, F>;
      NewT: IsError<F> extends true ? null : (T extends null ? F : T);
    } extends { NewErr: infer NewErr; NewT: infer NewT }
    ? VALIDATE_ALL<R, NewErr, NewT>
    : NEVER<F, "Could not parse error or new T">
  : Err extends null
  ? T
  : Err;

export type { NEVER, FALSE, VALIDATE_ALL };
