import { dbClient } from "@/infra/database";
import { links } from "@/infra/database/schemas";
import { Either, makeLeft, makeRight } from "@/shared/either";
import { eq } from "drizzle-orm";
import z from "zod/v4";
import { AlreadyExistsError } from "./errors/already-exists";

const createLinkInputSchema = z.object({
    url: z.url(),
    shortUrl: z.string().trim()
        .min(1, "Short URL cannot be empty")
        .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Short URL must be lowercase and contain no spaces/special characters."),
});

type CreateLinkInput = z.infer<typeof createLinkInputSchema>;

export async function createLink(
    input: CreateLinkInput
): Promise<Either<AlreadyExistsError, { message: string; }>> {
    const { url, shortUrl } = createLinkInputSchema.parse(input);

    const existingLink = await dbClient.query.links.findFirst({
        where: eq(links.shortUrl, shortUrl)
    });

    if (existingLink)
    {
        return makeLeft(new AlreadyExistsError())
    }

    const result = await dbClient.insert(links).values({
        url,
        shortUrl
    }).returning();

    return makeRight({ message: "Link created successfully!" });
}