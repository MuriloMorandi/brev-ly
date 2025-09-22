import { updateAccessCountLink } from '@/app/functions/update-acess-count-links';
import { NotFoundError } from './../../../app/functions/errors/not-found';
import { getLinkByShortUrl } from '@/app/functions/get-link-by-short-url';
import { isRight, unwrapEither } from '@/shared/either';
import { FastifyPluginAsyncZod } from 'fastify-type-provider-zod';
import z from 'zod/v4';


export const getLinkByShortUrlRoute: FastifyPluginAsyncZod = async (server) => {
    server.get("/:shortUrl",{
        schema:{
            summary: "Get link by short url",
            tags: ["Links"],
            params: z.object({
                shortUrl: z.string()
            }),
            response: {
                200: z.object({
                    url: z.string()
                }).describe("Successful Response"),
                404: z.object({
                    message: z.string()
                }).describe("Not found short url"),
            }
        }
    }, 
    async (request, reply) => {
        const { shortUrl } = request.params;

        const result = await getLinkByShortUrl({
            shortUrl
        })

        if(isRight(result)){
            const {id, url} =unwrapEither(result);
            
            updateAccessCountLink({id});
            
            return reply.send({url})    
        }

        const erro = unwrapEither(result);
        
        switch(erro.constructor.name) {
            case "NotFoundError":
                return reply.status(404).send({
                    message: erro.message
            });
        }
    }
)
}