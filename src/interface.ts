interface NeverMarked {
  _NEVER: 1;
  M: string[];
  T?: any;
}
interface FalseMarked {
  _FALSE: 1;
  M: string[];
  T?: any;
}
interface Marked {
  _NEVER?: 1;
  _FALSE?: 1;
  M: string[];
  T?: any;
}

export type { NeverMarked, FalseMarked, Marked };