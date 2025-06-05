// Result is a discriminated union that represents either a successful
// value or an error with error data
export type Result<T, E = string> =
  | {success: true; data: T}
  | {success: false; error: E};

export namespace Result {
  // builds the successful variant
  export function ok<T>(data: T): Result<T, never> {
    return {
      success: true,
      data,
    };
  }

  // builds the error variant
  export function err<E>(error: E): Result<never, E> {
    return {
      success: false,
      error,
    };
  }

  // type guard for success variant
  export function isOk<T, E>(
    res: Result<T, E>,
  ): res is {success: true; data: T} {
    return res.success;
  }

  // type guard for error variant
  export function isErr<T, E>(
    res: Result<T, E>,
  ): res is {success: false; error: E} {
    return !res.success;
  }

  // executes a function over the success variant
  export function map<T, U, E>(
    res: Result<T, E>,
    fn: (value: T) => U,
  ): Result<U, E> {
    return res.success ? ok(fn(res.data)) : res;
  }

  // executes a function that returns a result on the success variant
  export function flatMap<T, U, E>(
    res: Result<T, E>,
    fn: (value: T) => Result<U, E>,
  ): Result<U, E> {
    return res.success ? fn(res.data) : res;
  }

  // executes a function that returns a result and changes the error type
  export function biFlatMap<T, U, E, F>(
    res: Result<T, E>,
    fn: (value: T) => Result<U, F>,
    errFn: (error: E) => F,
  ): Result<U, F> {
    return res.success ? fn(res.data) : err(errFn(res.error));
  }

  // executes a function over the error variant
  export function mapError<T, E, F>(
    res: Result<T, E>,
    fn: (error: E) => F,
  ): Result<T, F> {
    return res.success ? res : err(fn(res.error));
  }

  // allows chaining of results
  export function andThen<T, U, E>(
    res: Result<T, E>,
    fn: (value: T) => Result<U, E>,
  ): Result<U, E> {
    return res.success ? fn(res.data) : res;
  }

  // fails-fast and returns the first error or all successes as a collection
  export function collect<T, E>(results: Result<T, E>[]): Result<T[], E> {
    const vals: T[] = [];
    for (const result of results) {
      if (isErr(result)) {
        return result;
      }
      vals.push(result.data);
    }
    return ok(vals);
  }
}
