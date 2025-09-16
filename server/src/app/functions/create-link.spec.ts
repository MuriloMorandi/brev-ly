import { describe, it, expect, beforeAll } from 'vitest';
import { createLink } from './create-link';
import { isLeft, isRight, unwrapEither } from '@/shared/either';
import { dbClient } from '@/infra/database';
import { links } from '@/infra/database/schemas';
import { eq } from 'drizzle-orm';
import { randomUUID } from 'node:crypto';
import { AlreadyExistsError } from './errors/already-exists';

describe('Create Link Function', () => {

    it('should create a new link successfully', async () => {
        const shortUrl = randomUUID();

        const sut = await createLink({
            url: 'https://example.com',
            shortUrl
        })

        expect(isRight(sut)).toBe(true);

        const resultDB = await dbClient.query.links.findFirst({
            where: eq(links.shortUrl, shortUrl)
        });

        expect(resultDB).toBeDefined();
    });

    it('should return an error if the short URL already exists', async () => {
        const shortUrl = randomUUID();
        
        await createLink({
            url: 'https://example.com',
            shortUrl
        })

        const sut = await createLink({
            url: 'https://example.com',
            shortUrl
        })

        expect(isLeft(sut)).toBe(true);
        expect(unwrapEither(sut)).toBeInstanceOf(AlreadyExistsError);
    });
   
});