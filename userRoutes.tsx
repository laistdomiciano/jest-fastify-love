const userRoutes = async (app) => {
    app.post("/users/register", async (request, reply) => {
        const { email, password } = request.body;
        
        if (!email || !password) {
            return reply.code(400).send({ error: "Missing fields" });
        }
        
        return reply.code(201).send({ message: "User registered" });
    });
};
