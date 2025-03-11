export function getNumber(): number {
  throw new Error("Database connection failed!");
}

export function addToNumberFromDb(value: number): number {
  const dbNumber = getNumber();
  return value + dbNumber;
}
