import type { AWS } from '@serverless/typescript';
import * as functions from '@handlers/index';
import config from 'config';

const serverlessConfiguration: AWS = {
    service: 'guitar-shop-cloudx',
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
            shouldStartNameWithService: true
        },
        environment: {
            AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
            NODE_OPTIONS: '--enable-source-maps --stack-trace-limit=1000'
        },
        iamRoleStatements: [
            {
                Effect: 'Allow',
                Action: 'sqs:*',
                Resource: { 'Fn::GetAtt': [config.sqsCatalogQueue, 'Arn'] },
            },
            {
                Effect: 'Allow',
                Action: 'sns:*',
                Resource: { Ref: config.snsCreateTopic },
            },
        ]
    },
    resources: {
        Resources: {
            [config.sqsCatalogQueue]: {
                Type: 'AWS::SQS::Queue',
                Properties: { QueueName: config.sqsCatalogQueue }
            },
            [config.snsCreateTopic]: {
                Type: 'AWS::SNS::Topic',
                Properties: { TopicName: config.snsCreateTopic }
            },
            [config.subscriptions.createProduct]: {
                Type: 'AWS::SNS::Subscription',
                Properties: {
                    Protocol: 'email',
                    Endpoint: config.email.primary,
                    TopicArn: { Ref: config.snsCreateTopic }
                }
            },
            [config.subscriptions.expensivePosition]: {
                Type: 'AWS::SNS::Subscription',
                Properties: {
                    Protocol: 'email',
                    FilterPolicy: { ExpensivePosition: ['true'] },
                    Endpoint: config.email.secondary,
                    TopicArn: { Ref: config.snsCreateTopic }
                }
            }
        }
    },
    functions,
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
