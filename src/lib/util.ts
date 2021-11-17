// Generic functional types
export type OptFn<I=any, O=any> = (_?: I) => O
export type UnaryFn<I=any, O=any> = (_: I) => O
export type Fn<I extends any[], O=any> = (..._: I) => O
