import { dbClient } from "@/infra/database";
import { links } from "@/infra/database/schemas";
import { Either, makeLeft, makeRight } from "@/shared/either";
import { create } from "domain";
import { asc, count, desc, eq, ilike } from "drizzle-orm";
import z from "zod/v4";

const listLinkInputSchema = z.object({
    searchQuery: z.string().optional(),
    sortBy: z.enum(['url', 'shortUrl', 'accessCount', 'createdAt']).optional(),
    sortDirection: z.enum(['asc', 'desc']).optional(),
    page: z.number().min(1).default(1),
    pageSize: z.number().min(1).max(100).default(10),
});

type ListLinkInput = z.infer<typeof listLinkInputSchema>;

type ListLinksOutput = {
    data: {
        id: string;
        url: string;
        shortUrl: string;
        accessCount: number;
        createdAt: Date;
        updatedAt: Date | null;
    }[];
    total: number;
}

export async function listLink(
    input: ListLinkInput
): Promise<Either<never, ListLinksOutput>> {
    const {
        page,
        pageSize,
        searchQuery,
        sortBy,
        sortDirection
    } = listLinkInputSchema.parse(input);

    const queryResult = dbClient
        .select({
            id: links.id,
            url: links.url,
            shortUrl: links.shortUrl,
            accessCount: links.accessCount,
            createdAt: links.createdAt,
            updatedAt: links.updatedAt,
        })
        .from(links)
        .limit(pageSize)
        .where(
            searchQuery ? ilike(links.url, `%${searchQuery}%`) : undefined
        )
        .offset((page - 1) * pageSize)
        .orderBy(fields => {
            if(sortBy && sortDirection === 'asc') {
                return asc(fields[sortBy]);
            }
            if(sortBy && sortDirection === 'desc') {
                return desc(fields[sortBy]);
            }

            return asc(fields.createdAt);
        });


    const queryCount = dbClient
        .select({
            count: count()
        })
        .from(links)
        .limit(pageSize)
        .where(
            searchQuery ? ilike(links.url, `%${searchQuery}%`) : undefined
        );

    const [result, [countResult]] = await Promise.all([
        queryResult,
        queryCount
    ]);

    return makeRight({ 
        data: result,
        total: countResult?.count ?? 0
    });
}