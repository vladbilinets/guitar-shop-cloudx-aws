import { AWS } from '@serverless/typescript';

const config = {
    region: 'eu-central-1' as AWS['provider']['region'],
    sqsCatalogQueue: 'catalogItemsQueue',
    buckets: {
        import: 'guitar-shop-cloudx-aws-import'
    },
    uploadedDir: 'uploaded',
    parsedDir: 'parsed',
};

export default config;
