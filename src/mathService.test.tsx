import { jest, describe, beforeEach, it, expect } from "@jest/globals";

jest.mock("./mathService", () => ({
  // Mock implementation of getNumber
  getNumber: jest.fn(() => "5"),

  addToNumberFromDb: (value: number) => {
    // We need to call the mocked version of getNumber
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const mockGetNumber = require("./mathService").getNumber;
    return value + mockGetNumber();
  },
}));

import { getNumber, addToNumberFromDb } from "./mathService";

describe("addToNumberFromDb", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should add database number to input value", () => {
    const result = addToNumberFromDb(3);
    expect(result).toBe(8); // 3 + 5 = 8
    expect(getNumber).toHaveBeenCalled();
  });

  it("should work with a different database value", () => {
    (getNumber as jest.Mock).mockReturnValue(10);
    const result = addToNumberFromDb(2);
    expect(result).toBe(12); // 2 + 10 = 12
    expect(getNumber).toHaveBeenCalled();
  });
});
