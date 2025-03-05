// Import dependencies
import Fastify from "fastify";
import { insightsRouter } from "./insightsRoutes";
import { appPostgresPool } from "./mockDatabase";

// Mock the database so actual queries are not run during tests
jest.mock("./mockDatabase", () => ({
    appPostgresPool: {
        query: jest.fn(),
    },
}));

describe("Insights Routes", () => {
    let app;

    // Before each test, reset mocks and initialize Fastify
    beforeEach(async () => {
        jest.clearAllMocks();
        app = Fastify();
        await app.register(insightsRouter);
    });

    // Test fetching insights summary
    it("should get insights summary for valid workspace", async () => {
        // Simulate database response with event data
        appPostgresPool.query.mockResolvedValueOnce({ rows: [{ eventType: "message_sent" }] });
        
        // Make a test API request
        const response = await app.inject({
            method: "GET",
            url: "/insights/workspaces/123/summary",
        });
        
        // Expect HTTP 200 status for successful response
        expect(response.statusCode).toBe(200);
    });
});
