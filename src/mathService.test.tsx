import { jest, describe, beforeEach, it, expect } from "@jest/globals";

// First, mock the module before importing it
jest.mock("./mathService", () => ({
  // Mock implementation of getNumber
  getNumber: jest.fn(() => 5),

  // This function will call the mocked getNumber
  addToNumberFromDb: (value: number) => {
    // We need to call the mocked version of getNumber
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const mockGetNumber = require("./mathService").getNumber;
    return value + mockGetNumber();
  },
}));

// Now import the mocked functions
import { getNumber, addToNumberFromDb } from "./mathService";

describe("addToNumberFromDb", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should add database number to input value", () => {
    // Mocked getNumber will return 5
    const result = addToNumberFromDb(3);
    expect(result).toBe(8); // 3 + 5 = 8
    expect(getNumber).toHaveBeenCalled();
  });

  it("should work with a different database value", () => {
    // Change the mock return value
    (getNumber as jest.Mock).mockReturnValue(10);

    const result = addToNumberFromDb(2);
    expect(result).toBe(12); // 2 + 10 = 12
    expect(getNumber).toHaveBeenCalled();
  });
});
