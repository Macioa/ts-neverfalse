type Unique<T extends string[], Acc extends string[] = []> = T extends [
    infer First extends string,
    ...infer Rest extends string[]
  ]
    ? First extends Acc[number]
      ? Unique<Rest, Acc>
      : Unique<Rest, [...Acc, First]>
    : { [K in keyof Acc]: Acc[K] };
  
  type R<T> = { [K in keyof T]: T[K] };

  export type { Unique, R };