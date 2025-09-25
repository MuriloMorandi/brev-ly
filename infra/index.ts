import * as aws from "@pulumi/aws";

const bucket = new aws.s3.Bucket("brevly-bucket", {
    bucket: 'brevly-bucket',
    tags: {
        IAC: "true",
    },
});

const ecr = new aws.ecr.Repository("brevly-ecr", {
    name: 'brevly-ecr',
    imageTagMutability: 'IMMUTABLE',
    tags: {
        IAC: "true",
    }
});

export const bucketName = bucket.id;

export const ecrName = ecr.name;
export const ecrRepositoryUrl = ecr.repositoryUrl;