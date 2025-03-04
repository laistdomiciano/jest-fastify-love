import Fastify from "fastify";

const insightsRouter = async (app) => {
    app.get("/insights/workspaces/:id/summary", async (request, reply) => {
        const { id } = request.params;
        
        if (!id) {
            return reply.code(400).send({ error: "Missing workspace ID" });
        }
        
        return reply.code(200).send({ summary: "Insights summary for workspace " + id });
    });
};

export { insightsRouter };
