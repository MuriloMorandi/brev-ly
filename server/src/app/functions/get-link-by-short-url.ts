import { dbClient } from "@/infra/database";
import { links } from "@/infra/database/schemas";
import { Either, makeLeft, makeRight } from "@/shared/either";
import { eq } from "drizzle-orm";
import z from "zod/v4";
import { NotFoundError } from "./errors/not-found";

const getLinkByShortUrlInputSchema = z.object({
    shortUrl: z.string().trim().min(1, "Short URL cannot be empty"),
});

type GetLinkByShortUrlInput = z.infer<typeof getLinkByShortUrlInputSchema>;

type GetLinkByShortUrlOutput = {
    id: string;
    url: string;
}

export async function getLinkByShortUrl(
    input: GetLinkByShortUrlInput
): Promise<Either<NotFoundError, GetLinkByShortUrlOutput>> {
    const {
        shortUrl
    } = getLinkByShortUrlInputSchema.parse(input);

    const result = await dbClient.query.links.findFirst({
        where: eq(links.shortUrl, shortUrl),
        columns:{
            id: true,
            url: true
        }
    });
    
    if (!result) {
        return makeLeft(new NotFoundError());
    }   

    return makeRight(result);
}