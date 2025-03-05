// Import dependencies
import Fastify from "fastify";
import { userRoutes } from "./userRoutes";
import { appPostgresPool } from "./mockDatabase";

// Mock the database so actual queries are not run during tests
jest.mock("./mockDatabase", () => ({
    appPostgresPool: {
        query: jest.fn(), // Mocked query function
    },
}));

describe("User Routes", () => {
    let app;

    // Before each test, reset mocks and initialize Fastify
    beforeEach(async () => {
        jest.clearAllMocks();
        app = Fastify();
        await app.register(userRoutes);
    });

    // Test user registration route
    it("should register a new user", async () => {
        // Simulate database query responses
        appPostgresPool.query.mockResolvedValueOnce([]); // No existing user
        appPostgresPool.query.mockResolvedValueOnce([{ id: 1, email: "test@example.com" }]);

        // Make a test API request to register a user
        const response = await app.inject({
            method: "POST",
            url: "/users/register",
            payload: { email: "test@example.com", password: "password123" },
        });

        // Expect HTTP 201 status for successful user creation
        expect(response.statusCode).toBe(201);
    });
});
