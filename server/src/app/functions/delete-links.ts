import { dbClient } from "@/infra/database";
import { links } from "@/infra/database/schemas";
import { Either, makeLeft, makeRight } from "@/shared/either";
import { eq } from "drizzle-orm";
import z from "zod/v4";

const deleteLinkInputSchema = z.object({
    id: z.uuid(),
});

type DeleteLinkInput = z.infer<typeof deleteLinkInputSchema>;

type DeleteLinkOutput = {
    id: string;
}

export async function deleteLink(
    input: DeleteLinkInput
): Promise<Either<never, DeleteLinkOutput[]>> {
    const {
        id
    } = deleteLinkInputSchema.parse(input);

    const result = await dbClient
        .delete(links)
        .where(eq(links.id, id)).returning({ id: links.id });

    return makeRight(result);
}