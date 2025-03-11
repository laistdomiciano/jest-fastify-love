import {
  jest,
  describe,
  beforeEach,
  afterAll,
  it,
  expect,
} from "@jest/globals";
import Fastify, { FastifyInstance } from "fastify";

jest.mock("./databases/db", () => ({
  appPostgresDb: {
    query: jest.fn(),
  },
}));

import { appPostgresDb } from "./databases/db";
import { insightsRoutes } from "./insightsRoutes";

describe("Insights Routes", () => {
  let app: FastifyInstance;

  const mockQuery = appPostgresDb.query as any;

  beforeEach(async () => {
    jest.clearAllMocks();

    app = Fastify();

    await app.register(insightsRoutes);
  });

  afterAll(async () => {
    await app.close();
  });

  it("should return insights total", async () => {
    mockQuery.mockResolvedValueOnce([{ total: 42 }]);

    const response = await app.inject({
      method: "GET",
      url: "/insights/total",
    });

    expect(response.statusCode).toBe(200);
    expect(JSON.parse(response.payload)).toEqual({ total: 42 });

    expect(mockQuery).toHaveBeenCalledWith(
      "SELECT COUNT(*) as total FROM data",
    );
  });
});
