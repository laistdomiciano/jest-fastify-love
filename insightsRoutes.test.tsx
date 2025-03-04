import Fastify from "fastify";
import { insightsRouter } from "./insightsRoutes";
import { appPostgresPool } from "./mockDatabase";

jest.mock("./mockDatabase", () => ({
    appPostgresPool: {
        query: jest.fn(),
    },
}));

describe("Insights Routes", () => {
    let app;

    beforeEach(async () => {
        jest.clearAllMocks();
        app = Fastify();
        await app.register(insightsRouter);
    });

    it("should get insights summary for valid workspace", async () => {
        appPostgresPool.query.mockResolvedValueOnce({ rows: [{ eventType: "message_sent" }] });
        
        const response = await app.inject({
            method: "GET",
            url: "/insights/workspaces/123/summary",
        });
        
        expect(response.statusCode).toBe(200);
    });
});
