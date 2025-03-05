// Import Fastify framework
import Fastify, { FastifyInstance } from "fastify";
import { appPostgresDb } from "./databases/db";

// 1. Register insights route
export async function insightsRoutes(app: FastifyInstance) {
  app.get("/insights", async (_request, reply) => {
    const insights = await appPostgresDb.query("SELECT COUNT(*) as total FROM users", []);
    return reply.status(200).send({ totalUsers: insights[0].total });
  });
}
