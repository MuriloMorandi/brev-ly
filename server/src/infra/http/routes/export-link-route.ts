import { createLink } from "@/app/functions/create-link";
import { exportLink } from "@/app/functions/export-links";
import { listLink } from "@/app/functions/list-links";
import { isRight, unwrapEither } from "@/shared/either";
import { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import z from "zod/v4";

export const exportLinkRoute: FastifyPluginAsyncZod = async (server) => {
    server.get(
        "/export",
        {
            schema: {
                summary: "Export all links",
                description: "Export all links to a CSV file.",
                tags: ["Links"],
                querystring: z.object({
                    searchQuery: z.string().optional(),
                }),
                response: {
                    200: z.object({
                        reportUrl: z.url(),
                    }).describe("Successful Response"),
                    500: z.object({
                        message: z.string()
                    }).describe("Internal Server Error"),
                }
            }
        },
        async (request, reply) => {
            const {
                searchQuery
            } = request.query;

            const result = await exportLink({
                searchQuery,
            });

           const { reportUrl } = unwrapEither(result);

            return reply.send({
                reportUrl
            });
        }
    );
};