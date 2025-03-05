// Import Fastify and necessary modules
import Fastify from "fastify";
import { userRoutes } from "./userRoutes";
import { appPostgresPool } from "./mockDatabase";

// Mock the database to prevent real database calls during testing
jest.mock("./mockDatabase", () => ({
    appPostgresPool: {
        query: jest.fn(), // Mocked database query function
    },
}));

describe("User Routes", () => {
    let app;

    // Before each test, reset mocks and initialize a new Fastify instance
    beforeEach(async () => {
        jest.clearAllMocks(); // Reset all mocks before running each test
        app = Fastify(); // Create a new Fastify instance
        await app.register(userRoutes); // Register the user routes
    });

    // Close Fastify instance after all tests to clean up resources
    afterAll(async () => {
        await app.close();
    });

    // Test successful user registration
    it("should register a new user", async () => {
        // Simulate database behavior:
        appPostgresPool.query.mockResolvedValueOnce([]); // Step 1: No user exists
        appPostgresPool.query.mockResolvedValueOnce([{ id: 1, email: "test@example.com" }]); // Step 2: User is created

        // Use Fastify's inject() method to simulate a POST request
        const response = await app.inject({
            method: "POST",
            url: "/users/register",
            payload: { email: "test@example.com", password: "password123" }, // Test payload
        });

        // Expect 201 (Created) response status
        expect(response.statusCode).toBe(201);

        // Parse response data
        const responseData = JSON.parse(response.payload);

        // Check if the response contains the correct success message
        expect(responseData).toHaveProperty("message", "User registered");
    });

    // Test missing required fields (email and password)
    it("should return 400 error if fields are missing", async () => {
        const response = await app.inject({
            method: "POST",
            url: "/users/register",
            payload: {}, // Empty payload, missing email and password
        });

        expect(response.statusCode).toBe(400);
        expect(JSON.parse(response.payload)).toHaveProperty("error", "Missing fields");
    });

    // Test registration failure (e.g., database error)
    it("should return 500 if database query fails", async () => {
        // Simulate database query failure
        appPostgresPool.query.mockRejectedValueOnce(new Error("Database error"));

        const response = await app.inject({
            method: "POST",
            url: "/users/register",
            payload: { email: "test@example.com", password: "password123" },
        });

        expect(response.statusCode).toBe(500);
        expect(JSON.parse(response.payload)).toHaveProperty("error");
    });
});
