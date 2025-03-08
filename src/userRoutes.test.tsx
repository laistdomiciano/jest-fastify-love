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
import { userRoutes } from "./userRoutes";

describe("User Routes", () => {
  let app: FastifyInstance;

  // Get a reference to the mocked query function using a simple 'any' type
  // This avoids TypeScript errors when using mockResolvedValueOnce
  const mockQuery = appPostgresDb.query as any;

  beforeEach(async () => {
    // Reset all mocks
    jest.clearAllMocks();

    // Create a new Fastify instance for each test
    app = Fastify();

    // Register the routes
    await app.register(userRoutes);
  });

  afterAll(async () => {
    // Clean up the Fastify instance
    await app.close();
  });

  it("should register a new user when email doesn't exist", async () => {
    // Set up mock responses:
    // First call - no existing user found
    mockQuery.mockResolvedValueOnce([]);

    // Second call - insert successful, return the new user
    mockQuery.mockResolvedValueOnce([
      {
        id: 1,
        email: "test@example.com",
        password: "hashedpass123",
      },
    ]);

    // Make a test request to create a user
    const response = await app.inject({
      method: "POST",
      url: "/users",
      payload: {
        email: "test@example.com",
        password: "password123",
      },
    });

    // Verify the response
    expect(response.statusCode).toBe(201);
    expect(JSON.parse(response.payload)).toEqual({
      id: 1,
      email: "test@example.com",
      password: "hashedpass123",
    });

    // Verify the database was queried correctly
    expect(mockQuery).toHaveBeenNthCalledWith(
      1,
      "SELECT * FROM users WHERE email = $1",
      ["test@example.com"],
    );

    expect(mockQuery).toHaveBeenNthCalledWith(
      2,
      "INSERT INTO users (email, password) VALUES ($1, $2) RETURNING *",
      ["test@example.com", "password123"],
    );
  });

  it("should return 400 when user already exists", async () => {
    // Mock that the user already exists
    mockQuery.mockResolvedValueOnce([
      {
        id: 1,
        email: "test@example.com",
        password: "existingpass",
      },
    ]);

    // Make a test request
    const response = await app.inject({
      method: "POST",
      url: "/users",
      payload: {
        email: "test@example.com",
        password: "password123",
      },
    });

    // Verify response is an error
    expect(response.statusCode).toBe(400);
    expect(JSON.parse(response.payload)).toEqual({
      error: "Email already exists",
    });

    // Verify only the SELECT query was called, not the INSERT
    expect(mockQuery).toHaveBeenCalledTimes(1);
  });
});
