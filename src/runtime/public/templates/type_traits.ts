type BoolLike = boolean | { Value: boolean };

type ValueOf<T> =
  T extends { Value: infer V extends boolean } ? V :
  T extends boolean ? T :
  never;

export type TNot<T extends BoolLike> =
  ValueOf<T> extends true ? false : true;

export type TAnd<T extends readonly BoolLike[]> =
  T extends [] ? true :
  T extends [infer H, ...infer R]
    ? ValueOf<H & BoolLike> extends true
      ? TAnd<R & readonly BoolLike[]>
      : false
    : never;

export type TOr<T extends readonly BoolLike[]> =
  T extends [] ? false :
  T extends [infer H, ...infer R]
    ? ValueOf<H & BoolLike> extends true
      ? true
      : TOr<R & readonly BoolLike[]>
    : never;

export type TXor<A extends BoolLike, B extends BoolLike> =
  ValueOf<A> extends true
    ? (ValueOf<B> extends true ? false : true)
    : (ValueOf<B> extends true ? true : false);
