// waits the given number of milliseconds before resolving the promise
export function delay(ms: number) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}
