// mathService.test.tsx
// 4. Import Jest utilities and our function
import { expect, jest, describe, beforeEach, test } from '@jest/globals';
import { addToNumberFromDb } from './mathService';
import * as db from './db';

// 5. Mock the database module
jest.mock('./db', () => ({
    getNumber: jest.fn(), // Replace real function with mock
}));

describe('addToNumberFromDb', () => {
    // 6. Clear mocks before each test
    beforeEach(() => {
        jest.clearAllMocks();
    });

    // 7. Test case 1: Basic addition
    test('should add database number to input', () => {
        // 8. Set mock to return 5
        (db.getNumber as jest.Mock).mockReturnValue(5);

        // 9. Call function with 3
        const result = addToNumberFromDb(3);

        // 10. Check if 3 + 5 = 8
        expect(result).toBe(8);
        expect(db.getNumber).toHaveBeenCalled(); // Verify DB call
    });

    // 11. Test case 2: Different value
    test('should work with different DB value', () => {
        // 12. Set mock to return 10
        (db.getNumber as jest.Mock).mockReturnValue(10);

        // 13. Call function with 2
        const result = addToNumberFromDb(2);

        // 14. Check if 2 + 10 = 12
        expect(result).toBe(12);
        expect(db.getNumber).toHaveBeenCalled();
    });
});
