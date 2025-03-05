// 1. Import our pretend database
import { getNumber } from './db';

// 2. Simple function to add a number from the DB
export function addToNumberFromDb(value: number): number {
    const dbNumber: number = getNumber(); // Get number from "database"
    return value + dbNumber; // Add them together
}

// db.tsx
// 3. Pretend database function
export function getNumber(): number {
    return 10; // Normally would query a real DB
}
