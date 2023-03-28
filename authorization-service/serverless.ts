import type { AWS } from '@serverless/typescript';
import * as functions from '@handlers/index';
import config from '@config/index';

const serverlessConfiguration: AWS = {
    service: 'cloudx-aws--authorization',
    frameworkVersion: '3',
    plugins: [
        'serverless-esbuild',
        'serverless-offline',
        'serverless-dotenv-plugin'
    ],
    provider: {
        name: 'aws',
        runtime: 'nodejs16.x',
        region: config.region,
        stage: config.stage,
        deploymentMethod: 'direct',
        apiGateway: {
            minimumCompressionSize: 1024,
            shouldStartNameWithService: true
        },
        environment: {
            AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
            NODE_OPTIONS: '--enable-source-maps --stack-trace-limit=1000'
        }
    },
    functions,
    package: { individually: true },
    custom: {
        dotenv: {
            path: '../.env',
            logging: true,
            required: {
                env: ['ACCOUNT_ID'],
                file: true
            }
        },
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
