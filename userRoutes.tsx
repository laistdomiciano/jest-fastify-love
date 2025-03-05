// User Routes for handling user registration

const userRoutes = async (app) => {
    // Define a route for user registration
    app.post("/users/register", async (request, reply) => {
        // Extract email and password from request body
        const { email, password } = request.body;
        
        // Validate input fields
        if (!email || !password) {
            return reply.code(400).send({ error: "Missing fields" });
        }
        
        // Simulate user creation response
        return reply.code(201).send({ message: "User registered" });
    });
};

export { userRoutes };
