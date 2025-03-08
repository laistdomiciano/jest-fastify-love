import { FastifyInstance } from "fastify";
import { appPostgresDb } from "./databases/db";

// Define interface for user data
interface User {
  id: number;
  email: string;
  password: string;
}

export async function userRoutes(app: FastifyInstance): Promise<void> {
  app.post("/users", async (request, reply) => {
    const { email, password } = request.body as {
      email: string;
      password: string;
    };

    // Check if user exists
    const existingUsersResult = await appPostgresDb.query(
      "SELECT * FROM users WHERE email = $1",
      [email],
    );

    // Type assertion for safety
    const existingUsers = existingUsersResult as unknown as User[];

    if (existingUsers.length > 0) {
      return reply.code(400).send({ error: "Email already exists" });
    }

    // Insert new user
    const newUserResult = await appPostgresDb.query(
      "INSERT INTO users (email, password) VALUES ($1, $2) RETURNING *",
      [email, password],
    );

    // Type assertion for the returned user
    const newUsers = newUserResult as unknown as User[];

    return reply.code(201).send(newUsers[0]);
  });
}
