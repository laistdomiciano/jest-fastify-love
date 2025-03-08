import {
  jest,
  describe,
  beforeEach,
  afterAll,
  it,
  expect,
} from "@jest/globals";
import Fastify, { FastifyInstance } from "fastify";

// Mock the database module before importing anything that uses it
jest.mock("./databases/db", () => ({
  appPostgresDb: {
    query: jest.fn(),
  },
}));

// Now import the modules that use the mocked database
import { appPostgresDb } from "./databases/db";
import { insightsRoutes } from "./insightsRoutes";

describe("Insights Routes", () => {
  let app: FastifyInstance;

  // Get a reference to the mocked query function using a simpler approach
  const mockQuery = appPostgresDb.query as any;

  beforeEach(async () => {
    // Reset all mocks
    jest.clearAllMocks();

    // Create a new Fastify instance for each test
    app = Fastify();

    // Register the routes
    await app.register(insightsRoutes);
  });

  afterAll(async () => {
    // Clean up the Fastify instance
    await app.close();
  });

  it("should return insights total", async () => {
    // Set up the mock to return a specific result
    mockQuery.mockResolvedValueOnce([{ total: 42 }]);

    // Make a test request
    const response = await app.inject({
      method: "GET",
      url: "/insights/total",
    });

    // Verify the response
    expect(response.statusCode).toBe(200);
    expect(JSON.parse(response.payload)).toEqual({ total: 42 });

    // Verify the database was queried correctly
    expect(mockQuery).toHaveBeenCalledWith(
      "SELECT COUNT(*) as total FROM data",
    );
  });
});
