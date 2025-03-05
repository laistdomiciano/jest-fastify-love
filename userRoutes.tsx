import Fastify, { FastifyInstance } from "fastify";
import { appPostgresDb } from "./databases/db";

// 1. Define User interface
interface User {
  id: number;
  email: string;
  password: string;
}

// 2. Register user routes
export async function userRoutes(app: FastifyInstance) {
  app.post("/users/register", async (request, reply) => {
    const { email, password } = request.body as { email: string; password: string };
    
    // Check if user exists
    const existing = await appPostgresDb.query("SELECT * FROM users WHERE email = $1", [email]);
    if (existing.length > 0) {
      return reply.status(400).send({ error: "User already exists" });
    }

    // Create user (in real app, password would be hashed)
    const newUser = await appPostgresDb.query(
      "INSERT INTO users (email, password) VALUES ($1, $2) RETURNING *",
      [email, password]
    );
    return reply.status(201).send({ accessToken: "fake-token", refreshToken: "fake-refresh" });
  });
}

// databases/db.tsx
export const appPostgresDb = {
  query: async (text: string, params: any[]) => Promise.resolve([]), // Dummy DB
};
