import { expect, jest, describe, beforeEach, afterAll, it } from "@jest/globals";
import Fastify, { FastifyInstance } from "fastify";
import { appPostgresDb } from "./databases/db";
import { insightsRoutes } from "./insights";

// 2. Mock the database
jest.mock("./databases/db", () => ({
  appPostgresDb: {
    query: jest.fn(),
  },
}));

describe("Insights Routes Integration", () => {
  let app: FastifyInstance;
  const mockQuery = appPostgresDb.query as jest.Mock;

  // 3. Setup
  beforeEach(async () => {
    jest.clearAllMocks();
    app = Fastify();
    await app.register(insightsRoutes);
  });

  // 4. Cleanup
  afterAll(async () => {
    await app.close();
  });

  // 5. Test getting insights
  it("should return total users", async () => {
    mockQuery.mockResolvedValueOnce([{ total: 42 }]);

    const response = await app.inject({
      method: "GET",
      url: "/insights",
    });

    expect(response.statusCode).toBe(200);
    const result = JSON.parse(response.payload);
    expect(result.totalUsers).toBe(42);
    expect(mockQuery).toHaveBeenCalledWith("SELECT COUNT(*) as total FROM users", []);
  });
});
