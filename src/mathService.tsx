// Function we want to mock in tests
export function getNumber(): number {
  return 10;
}

// Function we want to test that uses getNumber
export function addToNumberFromDb(value: number): number {
  const dbNumber = getNumber();
  return value + dbNumber;
}
