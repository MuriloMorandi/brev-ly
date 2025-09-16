import { describe, it, expect } from 'vitest';
import {  isRight, unwrapEither } from '@/shared/either';
import { faker } from '@faker-js/faker';
import { makeLink } from '@/test/factories/make-links';
import { listLink } from './list-links';
import dayjs from 'dayjs'
import { deleteLink } from './delete-links';
import { dbClient } from '@/infra/database';
import { eq } from 'drizzle-orm';
import { links } from '@/infra/database/schemas';


describe('Delete Links', () => {

    it('should be able to delete links', async () => {
        
        const link1 = await makeLink();

        const sut = await deleteLink({
            id: link1.id
        });

        expect(isRight(sut)).toBe(true);
    
        const resultDB = await dbClient.query.links.findFirst({
            where: eq(links.id, link1.id)
        });
        
        expect(resultDB).toBeUndefined();
    });

    it('should not delete other links', async () => {
        const link1 = await makeLink();
        const link2 = await makeLink();

        await deleteLink({ id: link1.id });

        let resultDB = await dbClient.query.links.findFirst({
            where: eq(links.id, link1.id)
        });
        
        expect(resultDB).toBeUndefined();

        resultDB = await dbClient.query.links.findFirst({
            where: eq(links.id, link2.id)
        });

        expect(resultDB).toBeDefined();
        expect(resultDB?.id).toBe(link2.id);
    });
});