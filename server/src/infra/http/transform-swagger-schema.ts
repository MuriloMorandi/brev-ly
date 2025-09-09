import { jsonSchemaTransform } from "fastify-type-provider-zod";

type TransformSwaggerSchemaDAta = Parameters<typeof jsonSchemaTransform>[0];

export function transformSwaggerSchema(data: TransformSwaggerSchemaDAta) {
    const { schema, url } = jsonSchemaTransform(data)

    return { schema, url }
}