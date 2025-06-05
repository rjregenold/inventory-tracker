declare const __brand: unique symbol;
type Brand<T, TBrand> = T & {readonly [__brand]: TBrand};
