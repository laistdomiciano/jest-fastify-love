// 1 Import Fastify & Jest for testing
import {
  jest,
  describe,
  beforeEach,
  afterAll,
  it,
  expect,
} from "@jest/globals";
import Fastify, { FastifyInstance } from "fastify";

// 2 Import the Modules that Use the Mocked Database
import { appPostgresDb } from "./databases/db";
import { userRoutes } from "./userRoutes";


// 3 Mock Dependencies (Database)
// Prevent actual database calls by mocking `appPostgresDb.query`
jest.mock("./databases/db", () => ({
  appPostgresDb: {
    query: jest.fn(),
  },
}));

describe("User Routes", () => {
  let app: FastifyInstance;

  // 4 Get a Reference to the Mocked Query Function
  // This allows us to set expectations and return custom values
  const mockQuery = appPostgresDb.query as any;

  beforeEach(async () => {
    // 5 Reset Mocks Before Each Tes
    jest.clearAllMocks();

    // 6 Create a New Fastify Instance for the Test
    app = Fastify();

    // 7 Register Routes to the Fastify Instance
    await app.register(userRoutes);
  });

  afterAll(async () => {
    //Step 10 Cleanup Fastify Instance After All Tests
    await app.close();
  });

  it("should register a new user when email doesn't exist", async () => {
    //Step 8 Define Mock Responses for Database Queries
    // First, return an empty result (user not found)
    mockQuery.mockResolvedValueOnce([]);

    // Second call - insert successful, return the new user
    mockQuery.mockResolvedValueOnce([
      {
        id: 1,
        email: "test@example.com",
        password: "hashedpass123",
      },
    ]);

    //Step 9 Inject a Request into Fastify to Simulate a User Registration
    const response = await app.inject({
      method: "POST",
      url: "/users",
      payload: {
        email: "test@example.com",
        password: "password123",
      },
    });

    //  Assert the Expected Response Status and Payload
    expect(response.statusCode).toBe(201);
    expect(JSON.parse(response.payload)).toEqual({
      id: 1,
      email: "test@example.com",
      password: "hashedpass123",
    });

    // Verify Mock Calls - Ensure the Right SQL Queries Were Made
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
    //Step 8 Mock the Database Query to Simulate an Existing User
    mockQuery.mockResolvedValueOnce([
      {
        id: 1,
        email: "test@example.com",
        password: "existingpass",
      },
    ]);

    //Step 9 Inject a Request with an Existing Email
    const response = await app.inject({
      method: "POST",
      url: "/users",
      payload: {
        email: "test@example.com",
        password: "password123",
      },
    });

    // Assert the Response for a Duplicate User
    expect(response.statusCode).toBe(400);
    expect(JSON.parse(response.payload)).toEqual({
      error: "Email already exists",
    });

    // Verify that Only the SELECT Query Was Executed (No INSERT)
    expect(mockQuery).toHaveBeenCalledTimes(1);
  });
});
