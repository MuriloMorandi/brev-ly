import { describe, it, expect, beforeAll, vi } from 'vitest';
import { isRight, unwrapEither } from '@/shared/either';
import { faker } from '@faker-js/faker';
import { makeLink } from '@/test/factories/make-links';
import { exportLink } from './export-links';
import * as upload from '@/infra/storage/upload-file-to-storage';
import { randomUUID } from 'node:crypto';


describe('Export Links', () => {

    it('should be able to export links', async () => {
        const uploadStub = vi.spyOn(upload, 'uploadFileToStorage')
            .mockImplementationOnce(async () => {
                return {
                    key: `${randomUUID}.csv`,
                    url: 'http://example.com/file.csv'
                }
            })

        const linkPattern = faker.internet.url();

        const link1 = await makeLink({ url: linkPattern });
        const link2 = await makeLink({ url: linkPattern, accessCount: 10 });
        const link3 = await makeLink({ url: linkPattern });
        const link4 = await makeLink({ url: linkPattern });

        const sut = await exportLink({
            searchQuery: linkPattern,
        });

        const generatedCSVStream = uploadStub.mock.calls[0][0].contentStream;

        const csvAsString = await new Promise<string>((resolve, reject) => {
            const chunks: Buffer[] = [];

            generatedCSVStream.on('data', (chunk: Buffer) => {
                chunks.push(chunk);
            });

            generatedCSVStream.on('end', () => {
                resolve(Buffer.concat(chunks).toString('utf-8'));
            });

            generatedCSVStream.on('error', err => {
                reject(err);
            });
        });

        const csvAsArray = csvAsString
            .trim()
            .split('\n')
            .map(row => row.split(','));

        expect(isRight(sut)).toBe(true);
        expect(unwrapEither(sut).reportUrl).toBe('http://example.com/file.csv');

        expect(csvAsArray).toEqual([
            [
                'ID',
                'URL',
                'Short URL',
                'Access Count',
                'Created At',
                'Updated At'
            ],
            [
                link1.id,
                link1.url,
                link1.shortUrl,
                link1.accessCount.toString(),
                expect.any(String),
                expect.any(String)
            ],
            [
                link2.id,
                link2.url,
                link2.shortUrl,
                link2.accessCount.toString(),
                expect.any(String),
                expect.any(String)
            ],
            [
                link3.id,
                link3.url,
                link3.shortUrl,
                link3.accessCount.toString(),
                expect.any(String),
                expect.any(String)
            ],
            [
                link4.id,
                link4.url,
                link4.shortUrl,
                link4.accessCount.toString(),
                expect.any(String),
                expect.any(String)
            ],
        ]);

    });

});