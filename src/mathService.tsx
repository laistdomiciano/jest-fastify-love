// Function we want to mock in tests
export function getNumber(): number {
  throw new Error("Database connection failed!");
}

// Function we want to test that uses getNumber
export function addToNumberFromDb(value: number): number {
  const dbNumber = getNumber();
  return value + dbNumber;
}
