// Generic functional types
export type OptFn<I=any, O=any> = (_?: I) => O
export type UnaryFn<I=any, O=any> = (_: I) => O
export type Fn<I extends any[], O=any> = (..._: I) => O

// Generic entries type
export type Entries<T> = {
  [K in keyof T]: [K, T[K]];
}[keyof T][];
