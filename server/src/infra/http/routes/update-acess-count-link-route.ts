import { updateAccessCountLink } from "@/app/functions/update-acess-count-links";
import { isRight, unwrapEither } from "@/shared/either";
import { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import z from "zod/v4";

export const updateAccessCountLinkRoute: FastifyPluginAsyncZod = async (server) => {
    server.patch(
        "/",
        {
            schema: {
                summary: "Update access count",
                description: "Increments the access count of a shortened link.",
                tags: ["Links"],
                querystring: z.object({
                    id: z.uuid()
                }),
                 response: {
                    200: z.object({
                        message: z.string()
                    }).describe("Successful Response"),
                    404: z.object({
                        message: z.string(),
                        issues: z.array(z.string())
                    }).describe("Link Not Found"),
                    500: z.object({
                        message: z.string()
                    }).describe("Internal Server Error"),
                }
            }
        },
        async (request, reply) => {
            const { id } = request.query;

            const result = await updateAccessCountLink({ id });

            if (isRight(result)) {
                return reply.status(200).send();
            }

            const error = unwrapEither(result);
            
            switch (error.constructor.name) {
                case "NotFoundError":
                    return reply.status(404).send({
                        message: "Link not found",
                        issues: ['id']
                    });
                default:
                    return reply.status(500).send({
                        message: "Internal Server Error"
                    });
            }
        }
    );
};
