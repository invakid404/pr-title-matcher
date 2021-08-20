export const notEmpty = <T>(val: T | null | undefined): val is T => {
  return val != null;
};
