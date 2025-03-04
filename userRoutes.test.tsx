import Fastify from "fastify";
import { userRoutes } from "./userRoutes";
import { appPostgresPool } from "./mockDatabase";

jest.mock("./mockDatabase", () => ({
    appPostgresPool: {
        query: jest.fn(),
    },
}));

describe("User Routes", () => {
    let app;

    beforeEach(async () => {
        jest.clearAllMocks();
        app = Fastify();
        await app.register(userRoutes);
    });

    it("should register a new user", async () => {
        appPostgresPool.query.mockResolvedValueOnce([]); // No user exists
        appPostgresPool.query.mockResolvedValueOnce([{ id: 1, email: "test@example.com" }]); // User created

        const response = await app.inject({
            method: "POST",
            url: "/users/register",
            payload: { email: "test@example.com", password: "password123" },
        });

        expect(response.statusCode).toBe(201);
    });
});
