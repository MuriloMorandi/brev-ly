import { log } from "@/shared/logger";
import { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import z from "zod";

export const healthCheckRoute: FastifyPluginAsyncZod = async (server) => {
    server.get(
        "/health",
        {
            schema: {
                summary: "Health Check",
                description: "Checks the health status of the server.",
                tags: ["Health"],
                response: {
                    200: z.object({
                        status: z.literal("ok")
                    }).describe("Successful Response"),
                }
            }
        },
        async (request, reply) => {
            log.info('Health check requested');
            return reply.send({ status: "ok" });
        }
    );
};