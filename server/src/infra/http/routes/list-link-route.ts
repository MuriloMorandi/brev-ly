import { listLink } from "@/app/functions/list-links";
import { unwrapEither } from "@/shared/either";
import { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import z from "zod/v4";

export const listLinkRoute: FastifyPluginAsyncZod = async (server) => {
    server.get(
        "",
        {
            schema: {
                summary: "List all links",
                description: "Retrieves a list of all shortened links.",
                tags: ["Links"],
                querystring: z.object({
                    searchQuery: z.string().optional(),
                    sortBy: z.enum(['url', 'shortUrl', 'accessCount', 'createdAt']).optional(),
                    sortDirection: z.enum(['asc', 'desc']).optional(),
                    page: z.coerce.number().min(1).default(1),
                    pageSize: z.coerce.number().min(1).max(100).default(10),
                }),
                response: {
                    200: z.object({
                        data: z.array(z.any()),
                        total: z.number()
                    }).describe("Successful Response"),
                    500: z.object({
                        message: z.string()
                    }).describe("Internal Server Error"),
                }
            }
        },
        async (request, reply) => {
            const {
                searchQuery,
                sortBy,
                sortDirection,
                page,
                pageSize
            } = request.query;

            const result = await listLink({
                searchQuery,
                sortBy,
                sortDirection,
                page,
                pageSize
            });

            const { data, total } = unwrapEither(result);
            
            return reply.send({
                data,
                total
            });
        }
    );
};