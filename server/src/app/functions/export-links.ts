import { dbClient, pgInstance } from "@/infra/database";
import { links } from "@/infra/database/schemas";
import { Either, makeLeft, makeRight } from "@/shared/either";
import { asc, eq, ilike } from "drizzle-orm";
import z from "zod/v4";
import { stringify } from "csv-stringify";
import { pipeline } from "node:stream/promises";
import { uploadFileToStorage } from "@/infra/storage/upload-file-to-storage";
import { PassThrough, Transform } from "node:stream";

const exportLinkInputSchema = z.object({
    searchQuery: z.string().optional(),
});

type ExportLinkInput = z.infer<typeof exportLinkInputSchema>;

type ExportLinksOutput = {
    reportUrl: string;
}

export async function exportLink(
    input: ExportLinkInput
): Promise<Either<never, ExportLinksOutput>> {
    const {
        searchQuery,
    } = exportLinkInputSchema.parse(input);

    const { sql, params } = dbClient
        .select({
            id: links.id,
            url: links.url,
            shortUrl: links.shortUrl,
            accessCount: links.accessCount,
            createdAt: links.createdAt,
            updatedAt: links.updatedAt,
        })
        .from(links)
        .where(
            searchQuery ? ilike(links.url, `%${searchQuery}%`) : undefined
        )
        .orderBy(asc(links.createdAt))
        .toSQL();

    const cursor = pgInstance.unsafe(sql, params as string[]).cursor(1);

    const csv = stringify({
        delimiter: ',',
        header: true,
        columns: [
            { key: 'id', header: 'ID' },
            { key: 'url', header: 'URL' },
            { key: 'short_url', header: 'Short URL' },
            { key: 'access_count', header: 'Access Count' },
            { key: 'created_at', header: 'Created At' },
            { key: 'updated_at', header: 'Updated At' },
        ]
    });

    const uploadToStorageStream = new PassThrough();

    const convertToCSVPipeline = pipeline(
        cursor,
        new Transform({
            objectMode: true,
            transform(chunks: unknown[], encoding, callback) {
                for (const chunk of chunks)
                {
                    this.push(chunk);
                }

                callback();
            },
        }),
        csv,
        uploadToStorageStream
    );

    const uploadToStorage = uploadFileToStorage({
        folder: 'downloads',
        fileName: 'report.csv',
        contentType: 'text/csv',
        contentStream: uploadToStorageStream,
    });

    const [{ url }] = await Promise.all([
        uploadToStorage,
        convertToCSVPipeline
    ]);


    return makeRight({
        reportUrl: url
    });
}