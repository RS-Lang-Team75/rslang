export function shuffleArray<T> (arr: Array<T>): Array<T> {
  const shuffledArray = arr.slice();
  if (arr.length > 1) {
    for (let i = 0; i < shuffledArray.length; i += 1) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]];
    }
  }
  return shuffledArray;
}
