// This is our mock database module
import { jest } from "@jest/globals";

// Export a mock database with a query function that can be mocked in tests
export const appPostgresDb = {
  query: jest.fn(),
};
