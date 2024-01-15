export const randomFromArray = <T>(arr: T[] | readonly T[]): T => {
  if (arr.length === 0) {
    throw new Error('Cannot get random element from empty array');
  }

  if (arr.length === 1) {
    return arr[0];
  }

  return arr[Math.floor(Math.random() * (arr.length - 1))];
};
