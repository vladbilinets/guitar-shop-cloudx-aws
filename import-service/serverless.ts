import type { AWS } from '@serverless/typescript';
import {
    importProductsFile,
    importFileParser
} from '@handlers/index';
import config from '@config/index';

const serverlessConfiguration: AWS = {
    service: 'cloudx-aws--import',
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
        iamRoleStatements: [
            {
                Effect: 'Allow',
                Action: ['s3:*'],
                Resource: [
                    `arn:aws:s3:::${config.buckets.import}`,
                    `arn:aws:s3:::${config.buckets.import}/*`
                ]
            },
            {
                Effect: 'Allow',
                Action: 'sqs:SendMessage',
                Resource: config.sqs.catalogQueue.arn
            }
        ],
        apiGateway: {
            minimumCompressionSize: 1024,
            shouldStartNameWithService: true
        },
        environment: {
            AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
            NODE_OPTIONS: '--enable-source-maps --stack-trace-limit=1000'
        }
    },
    functions: {
        importProductsFile,
        importFileParser
    },
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
