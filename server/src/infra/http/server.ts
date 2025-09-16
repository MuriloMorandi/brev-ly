import { fastify } from 'fastify'
import { fastifyCors } from '@fastify/cors'
import { env } from '@/env'
import { hasZodFastifySchemaValidationErrors, serializerCompiler, validatorCompiler } from 'fastify-type-provider-zod';
import { createLinkRoute } from './routes/create-link-route';
import fastifySwagger from '@fastify/swagger';
import { transformSwaggerSchema } from './transform-swagger-schema';
import { fastifySwaggerUi } from '@fastify/swagger-ui';
import { listLinkRoute } from './routes/list-link-route';
import { deleteLinkRoute } from './routes/delete-link-route';
import { updateAccessCountLinkRoute } from './routes/update-acess-count-link-route';
import { exportLinkRoute } from './routes/export-link-route';

const server = fastify()

server.setValidatorCompiler(validatorCompiler);
server.setSerializerCompiler(serializerCompiler);

server.setErrorHandler((error, request, reply) => {
    if (hasZodFastifySchemaValidationErrors(error))
    {
        return reply.status(400).send({
            message: 'Validation error',
            issues: error.validation,
        });
    }

    console.error(error);

    return reply.status(500).send({ message: 'Internal server error.' });
});

server.register(fastifySwagger, {
  openapi: {
    info: {
      title: 'Brev-ly API',
      version: '1.0.0',
    },
  },
  transform: transformSwaggerSchema,
});

server.register(fastifySwaggerUi, {
  routePrefix: '/docs',
});

server.register(fastifyCors, {
    origin: '*',
})

server.register(createLinkRoute, { prefix: '/links' })
server.register(listLinkRoute, { prefix: '/links' })
server.register(deleteLinkRoute, { prefix: '/links' })
server.register(updateAccessCountLinkRoute, { prefix: '/links' })
server.register(exportLinkRoute, { prefix: '/links' })


server.listen({ port: env.PORT, host: '0.0.0.0' }).then(val => {
    console.log('HTTP Server running!');
    console.log(`Docs: http://localhost:${env.PORT}/docs`);
});