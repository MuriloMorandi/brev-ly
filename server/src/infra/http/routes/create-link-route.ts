import { createLink } from "@/app/functions/create-link";
import { isRight, unwrapEither } from "@/shared/either";
import { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import z from "zod/v4";

export const createLinkRoute: FastifyPluginAsyncZod = async (server) => {
    server.post(
        "/",
        {
            schema: {
                summary: "Create a new link",
                description: "Creates a new shortened link.",
                tags: ["Links"],
                body: z.object({
                    url: z.url(),
                    shortUrl: z.string().trim().min(1, "Short URL cannot be empty"),
                }),
                response: {
                    201: z.object({
                        message: z.string()
                    }).describe("Successful Response"),
                    409: z.object({
                        message: z.string(),
                        issues: z.array(z.string())
                    }).describe("Conflict Response"),
                    500: z.object({
                        message: z.string()
                    }).describe("Internal Server Error"),
                }
            }
        },
        async (request, reply) => {
            const { shortUrl, url} = request.body;
            
            const result = await createLink({
                shortUrl,
                url
            });

            if(isRight(result)) {
                return reply.status(201).send({
                    message: result.right.message
                });
            }

            const erro = unwrapEither(result);

            switch(erro.constructor.name) {
                case "AlreadyExistsError":
                    return reply.status(409).send({
                        message: "Short URL already exists",
                        issues: ['short_url']
                    });
                default:
                    return reply.status(500).send({
                        message: "Internal Server Error"
                    });
            }
        }
    );
};