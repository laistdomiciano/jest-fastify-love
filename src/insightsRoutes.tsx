import { FastifyInstance } from "fastify";
import { appPostgresDb } from "./databases/db";

interface QueryResult {
  total: number;
}

export async function insightsRoutes(app: FastifyInstance): Promise<void> {
  app.get("/insights/total", async (_request, reply) => {
    // Query the database for the total count
    const result = await appPostgresDb.query(
      "SELECT COUNT(*) as total FROM data",
    );

    const typedResult = result as unknown as QueryResult[];

    return reply.send({ total: typedResult[0].total });
  });
}
