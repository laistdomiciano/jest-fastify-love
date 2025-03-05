// Import Fastify and necessary modules
import Fastify from "fastify";
import { insightsRouter } from "./insightsRoutes";
import { appPostgresPool } from "./mockDatabase";

// Mock the database so actual queries are not executed
jest.mock("./mockDatabase", () => ({
    appPostgresPool: {
        query: jest.fn(),
    },
}));

describe("Insights Routes", () => {
    let app;

    // Before each test, reset mocks and initialize a new Fastify instance
    beforeEach(async () => {
        jest.clearAllMocks(); // Reset mocks between tests
        app = Fastify(); // Create a new Fastify instance
        await app.register(insightsRouter); // Register the routes
    });

    // Close Fastify instance after all tests are completed
    afterAll(async () => {
        await app.close();
    });

    // Test fetching insights summary for a valid workspace
    it("should return insights summary for valid workspace", async () => {
        // Mock the database response to return sample events
        appPostgresPool.query.mockResolvedValueOnce({
            rows: [{ eventType: "message_sent", timestamp: "2025-02-19T00:00:00Z" }],
        });

        // Use Fastify's inject() method to simulate an API request
        const response = await app.inject({
            method: "GET",
            url: "/insights/workspaces/123/summary",
            headers: { authorization: "Bearer test-token" }, // Simulate authentication if required
        });

        // Ensure the response status is 200 (OK)
        expect(response.statusCode).toBe(200);

        // Parse JSON response
        const responseData = JSON.parse(response.payload);

        // Validate response structure
        expect(responseData).toHaveProperty("summary");
    });

    // Test handling of missing workspace ID
    it("should return 400 error when workspace ID is missing", async () => {
        const response = await app.inject({
            method: "GET",
            url: "/insights/workspaces//summary", // Invalid URL with missing ID
        });

        expect(response.statusCode).toBe(400);
        expect(JSON.parse(response.payload)).toHaveProperty("error");
    });

    // Test unauthorized access (if authentication is implemented)
    it("should return 401 er
