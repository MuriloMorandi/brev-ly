import { dbClient } from "@/infra/database";
import { links } from "@/infra/database/schemas";
import {fakerPT_BR as faker} from '@faker-js/faker';
import { InferInsertModel } from "drizzle-orm";

export async function makeLink(
    overrides?: Partial<InferInsertModel<typeof links>>
) {
    const result = await dbClient
        .insert(links)
        .values({
            url: faker.internet.url(),
            shortUrl: faker.internet.domainName(),
            ...overrides
        })
        .returning();

    return result[0];
}