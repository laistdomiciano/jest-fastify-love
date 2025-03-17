import { jest, describe, beforeEach, it, expect } from "@jest/globals";
import { getNumber, addToNumberFromDb } from "./mathService";

jest.mock("./mathService", () => ({
  getNumber: jest.fn(() => "5"),

  addToNumberFromDb: (value: number) => {
    const mockGetNumber = require("./mathService").getNumber;
    return value + mockGetNumber();
  },
}));

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
