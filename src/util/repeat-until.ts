export function repeatUntil<T>(shouldStop: (t: T) => boolean, betweenMS: number, fn: () => Promise<T>) {
  return new Promise<T>(async (resolve) => {
    let shouldProceed = true;
    while (shouldProceed) {
      const result = await fn();
      if (shouldStop(result)) {
        shouldProceed = false;
        return resolve(result);
      }
      await new Promise((resolve1) => setTimeout(resolve1, betweenMS));
    }
  });
}
