import { describe, it, expect } from 'vitest';
import { isRight, unwrapEither } from '@/shared/either';
import { faker } from '@faker-js/faker';
import { makeLink } from '@/test/factories/make-links';
import { getLinkByShortUrl } from './get-link-by-short-url';
import { NotFoundError } from './errors/not-found';

describe('Get url by short url', () => {

    it('should be able to get link by short url', async () => {
        
        const shortUrlPattern = faker.lorem.word();
        const link = await makeLink({ shortUrl:shortUrlPattern });

        const sut = await getLinkByShortUrl({
            shortUrl: shortUrlPattern
        });
        
        expect(isRight(sut)).toBe(true);
        if(isRight(sut)){
            expect(unwrapEither(sut).url).toBe(link.url);
        }
    
    });

    it('should return an error if the short URL already exists', async () => {
        const shortUrlPattern = faker.lorem.word();
        
        await makeLink();

        const sut = await getLinkByShortUrl({
            shortUrl: shortUrlPattern
        });
        
        expect(isRight(sut)).toBe(false);
        expect(unwrapEither(sut)).toBeInstanceOf(NotFoundError)
    });

});