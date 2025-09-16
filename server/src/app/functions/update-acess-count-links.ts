import { dbClient } from "@/infra/database";
import { links } from "@/infra/database/schemas";
import { Either, makeLeft, makeRight } from "@/shared/either";
import { eq } from "drizzle-orm";
import z from "zod/v4";
import { NotFoundError } from "./errors/not-found";

const updateAccessCountLinkInputSchema = z.object({
    id: z.uuid(),
});

type UpdateAccessCountLinkInput = z.infer<typeof updateAccessCountLinkInputSchema>;

type UpdateAccessCountLinkOutput = {
    id: string;
    url: string;
    shortUrl: string;
    accessCount: number;
    createdAt: Date;
    updatedAt: Date | null;
}

export async function updateAccessCountLink(
    input: UpdateAccessCountLinkInput
): Promise<Either<NotFoundError, UpdateAccessCountLinkOutput>> {
    const {
        id
    } = updateAccessCountLinkInputSchema.parse(input);

    const [link] = await dbClient
        .select()
        .from(links)
        .where(eq(links.id, id))
        .limit(1);

    if (!link) {
        return makeLeft(new NotFoundError());
    }

    const [result] = await dbClient
        .update(links)
        .set({ 
            accessCount: link.accessCount + 1,
            updatedAt: new Date()
        })
        .where(eq(links.id, id))
        .returning({ 
            id: links.id,
            url: links.url,
            shortUrl: links.shortUrl,
            accessCount: links.accessCount,
            createdAt: links.createdAt,
            updatedAt: links.updatedAt,
        });

    return makeRight(result);
}