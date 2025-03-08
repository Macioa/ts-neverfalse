declare global {
  namespace NeverFalse {
    interface Config {}
  }
}
interface NFConfig {
    includeT?: boolean;
}

type Config<T> = { includeT: false } & T;

type includeT<T extends NFConfig> = T["includeT"] extends true ? true : false;
type INCLUDE_T = includeT<NeverFalse.Config>;

export type { INCLUDE_T, includeT, Config };
