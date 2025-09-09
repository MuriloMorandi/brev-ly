import { FastifyPluginAsyncZod } from "fastify-type-provider-zod";

export const linkRoute: FastifyPluginAsyncZod = async (server) => {

    server.get(
        "/",
        async (request, reply) => {
            return reply.send({ message: "Hello World!" });
        }
    );
};