import { expect, jest, describe, beforeEach, afterAll, it } from "@jest/globals";
import Fastify, { FastifyInstance } from "fastify";
import { appPostgresDb } from "./databases/db";
import { userRoutes } from "./userRoutes";

// 3. Mock the database
jest.mock("./databases/db", () => ({
  appPostgresDb: {
    query: jest.fn(), // Mocked DB query function
  },
}));

describe("User Routes Integration", () => {
  let app: FastifyInstance;
  const mockQuery = appPostgresDb.query as jest.Mock;

  // 4. Setup Fastify before each test
  beforeEach(async () => {
    jest.clearAllMeters();
    app = Fastify();
    await app.register(userRoutes);
  });

  // 5. Cleanup
  afterAll(async () => {
    await app.close();
  });

  // 6. Test successful registration
  it("should register a new user", async () => {
    mockQuery.mockResolvedValueOnce([]); // No existing user
    mockQuery.mockResolvedValueOnce([{ id: 1, email: "test@example.com", password: "pass" }]);

    const response = await app.inject({
      method: "POST",
      url: "/users/register",
      payload: { email: "test@example.com", password: "pass" },
    });

    expect(response.statusCode).toBe(201);
    const result = JSON.parse(response.payload);
    expect(result).toHaveProperty("accessToken");
    expect(mockQuery).toHaveBeenCalledWith("SELECT * FROM users WHERE email = $1", ["test@example.com"]);
  });

  // 7. Test duplicate user
  it("should reject duplicate user", async () => {
    mockQuery.mockResolvedValueOnce([{ id: 1, email: "test@example.com", password: "pass" }]);

    const response = await app.inject({
      method: "POST",
      url: "/users/register",
      payload: { email: "test@example.com", password: "pass" },
    });

    expect(response.statusCode).toBe(400);
    expect(JSON.parse(response.payload)).toHaveProperty("error");
  });
});
