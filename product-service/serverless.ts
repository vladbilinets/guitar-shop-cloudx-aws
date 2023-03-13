import type { AWS } from '@serverless/typescript';
import {
    getProductList,
    getProductById,
    createProduct
} from '@handlers/index';
import config from 'config';

const serverlessConfiguration: AWS = {
    service: 'guitar-shop-cloudx-aws',
    frameworkVersion: '3',
    plugins: [
        'serverless-esbuild',
        'serverless-offline'
    ],
    provider: {
        name: 'aws',
        runtime: 'nodejs16.x',
        region: config.region,
        role: 'arn:aws:iam::214342703654:role/DynamoDBLambdaAccessRole',
        stage: 'dev',
        apiGateway: {
            minimumCompressionSize: 1024,
            shouldStartNameWithService: true,
        },
        environment: {
            AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
            NODE_OPTIONS: '--enable-source-maps --stack-trace-limit=1000',
        },
    },
    functions: {
        getProductList,
        getProductById,
        createProduct
    },
    package: { individually: true },
    custom: {
        esbuild: {
            bundle: true,
            minify: true,
            sourcemap: true,
            exclude: ['aws-sdk'],
            target: 'node16',
            define: { 'require.resolve': undefined },
            platform: 'node',
            concurrency: 10
        }
    }
};

module.exports = serverlessConfiguration;
