// 1. Bring in the function we want to test
const { addToNumberFromDb } = require('./mathService');

// 2. Bring in the database module that we'll mock
const db = require('./db');

// 3. Tell Jest to replace the real database with a fake (mock) version
jest.mock('./db');

// 4. Group our tests together with a description
describe('addToNumberFromDb', () => {
  // 5. Write our first test
  test('should add database number to input value', () => {
    // 6. Set up our mock: pretend the database returns 5
    db.getNumber.mockReturnValue(5);

    // 7. Call the function with 3, expect it to add 5 from our mock db
    const result = addToNumberFromDb(3);

    // 8. Check if we get 8 (3 + 5)
    expect(result).toBe(8);

    // 9. Make sure the database function was actually called
    expect(db.getNumber).toHaveBeenCalled();
  });

  // 10. Add another test for a different scenario
  test('should work with a different database value', () => {
    // 11. Change what our mock database returns
    db.getNumber.mockReturnValue(10);

    // 12. Test with a different input
    const result = addToNumberFromDb(2);

    // 13. Check if we get 12 (2 + 10)
    expect(result).toBe(12);

    // 14. Verify the mock was called again
    expect(db.getNumber).toHaveBeenCalled();
  });
});
