import { describe, it, expect } from 'vitest';
import {  isRight, unwrapEither } from '@/shared/either';
import { faker } from '@faker-js/faker';
import { makeLink } from '@/test/factories/make-links';
import { listLink } from './list-links';
import dayjs from 'dayjs'


describe('List Links', () => {

    it('should be able to list links', async () => {
        const linkPattern = faker.internet.url();

        const link1 = await makeLink({url: linkPattern});
        const link2 = await makeLink({url: linkPattern});
        const link3 = await makeLink({url: linkPattern});
        const link4 = await makeLink({url: linkPattern});

        const sut = await listLink({
            searchQuery: linkPattern,
            page: 1,
            pageSize: 10,
        });
        
        expect(isRight(sut)).toBe(true);
        expect(unwrapEither(sut).total).toEqual(4);
        expect(unwrapEither(sut).data).toEqual([link1, link2, link3, link4]);
    });

    it('should be able to list paginated links', async () => {
        const linkPattern = faker.internet.url();

        const link1 = await makeLink({url: linkPattern});
        const link2 = await makeLink({url: linkPattern});
        const link3 = await makeLink({url: linkPattern});
        const link4 = await makeLink({url: linkPattern});

        let sut = await listLink({
            searchQuery: linkPattern,
            page: 1,
            pageSize: 1,
        });
        
        expect(isRight(sut)).toBe(true);
        expect(unwrapEither(sut).total).toEqual(4);
        expect(unwrapEither(sut).data).toEqual([link1]);

        sut = await listLink({
            searchQuery: linkPattern,
            page: 2,
            pageSize: 1,
        });

        expect(isRight(sut)).toBe(true);
        expect(unwrapEither(sut).total).toEqual(4);
        expect(unwrapEither(sut).data).toEqual([link2]);

        sut = await listLink({
            searchQuery: linkPattern,
            page: 2,
            pageSize: 2,
        });

        expect(isRight(sut)).toBe(true);
        expect(unwrapEither(sut).total).toEqual(4);
        expect(unwrapEither(sut).data).toEqual([link3, link4]);
    });
   
    it('should be able to list sorted links', async () => {
        const linkPattern = faker.internet.url();

        const link1 = await makeLink({
            url: linkPattern,
            createdAt: dayjs().subtract(1, 'day').toDate()
        });
        const link2 = await makeLink({
            url: linkPattern,
            createdAt: dayjs().subtract(2, 'day').toDate()
        });
        const link3 = await makeLink({
            url: linkPattern,
            createdAt: dayjs().subtract(3, 'day').toDate()
        });
        const link4 = await makeLink({
            url: linkPattern,
            createdAt: dayjs().subtract(4, 'day').toDate()
        });

        let sut = await listLink({
            searchQuery: linkPattern,
            page: 1,
            pageSize: 10,
            sortDirection: 'asc',
            sortBy: 'createdAt',
        });
        
        expect(isRight(sut)).toBe(true);
        expect(unwrapEither(sut).total).toEqual(4);
        expect(unwrapEither(sut).data).toEqual([link4, link3, link2, link1]);

        sut = await listLink({
            searchQuery: linkPattern,
            page: 1,
            pageSize: 10,
            sortDirection: 'desc',
            sortBy: 'createdAt',
        });
        
        expect(isRight(sut)).toBe(true);
        expect(unwrapEither(sut).total).toEqual(4);
        expect(unwrapEither(sut).data).toEqual([link1, link2, link3, link4]);

    });
});