import { FastifyInstance } from "fastify";
import { appPostgresDb } from "./databases/db";

// Define a type for the query result
interface QueryResult {
  total: number;
}

export async function insightsRoutes(app: FastifyInstance): Promise<void> {
  app.get("/insights/total", async (_request, reply) => {
    // Query the database for the total count
    const result = await appPostgresDb.query(
      "SELECT COUNT(*) as total FROM data",
    );

    // Type assertion to let TypeScript know what we expect
    const typedResult = result as unknown as QueryResult[];

    // Return the result
    //return reply.send({ total: String(typedResult[0].total) });
    return reply.send({ total: typedResult[0].total });
  });
}
