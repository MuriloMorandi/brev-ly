import { deleteLink } from "@/app/functions/delete-links";
import { listLink } from "@/app/functions/list-links";
import { isRight, unwrapEither } from "@/shared/either";
import { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import z from "zod/v4";

export const deleteLinkRoute: FastifyPluginAsyncZod = async (server) => {
    server.delete(
        "/",
        {
            schema: {
                summary: "Delete links",
                description: "Deletes a shortened link.",
                tags: ["Links"],
                querystring: z.object({
                    id: z.uuid()
                })
            }
        },
        async (request, reply) => {
            const { id } = request.query;

            const result = await deleteLink({ id });

            if (isRight(result)) {
                return reply.status(200).send();
            }

            return reply.status(404).send({
                message: "Link not found"
            });
        }
    );
};
