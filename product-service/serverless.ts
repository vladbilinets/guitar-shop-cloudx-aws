import type { AWS } from '@serverless/typescript';
import * as functions from '@handlers/index';
import config from '@config/index';

const serverlessConfiguration: AWS = {
    service: 'guitar-shop-cloudx',
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
        deploymentMethod: 'direct',
        role: `arn:aws:iam::${config.accountId}:role/DynamoDBLambdaAccessRole`,
        stage: config.stage,
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
                Resource: { Ref: config.sqs.catalogQueue.name }
            },
            {
                Effect: 'Allow',
                Action: 'sns:*',
                Resource: { Ref: config.sns.createTopic.name }
            }
        ]
    },
    resources: {
        Resources: {
            [config.sqs.catalogQueue.name]: {
                Type: 'AWS::SQS::Queue',
                Properties: { QueueName: config.sqs.catalogQueue.name }
            },
            [config.sns.createTopic.name]: {
                Type: 'AWS::SNS::Topic',
                Properties: { TopicName: config.sns.createTopic.name }
            },
            [config.subscriptions.createProduct]: {
                Type: 'AWS::SNS::Subscription',
                Properties: {
                    Protocol: 'email',
                    Endpoint: config.email.primary,
                    TopicArn: { Ref: config.sns.createTopic.name }
                }
            },
            [config.subscriptions.expensivePosition]: {
                Type: 'AWS::SNS::Subscription',
                Properties: {
                    Protocol: 'email',
                    FilterPolicy: { ExpensivePosition: ['true'] },
                    Endpoint: config.email.secondary,
                    TopicArn: { Ref: config.sns.createTopic.name }
                }
            },
            LambdaExecutorRole: {
                Type: 'AWS::IAM::Role',
                Properties: {
                    RoleName: 'LambdaExecutorRole',
                    Description: 'CatalogBatchProcess executor role',
                    ManagedPolicyArns: [
                        'arn:aws:iam::aws:policy/AmazonSQSFullAccess',
                        'arn:aws:iam::aws:policy/service-role/AWSLambdaSQSQueueExecutionRole'
                    ],
                    AssumeRolePolicyDocument: {
                        Version: '2012-10-17',
                        Statement: {
                            Effect: 'Allow',
                            Principal: { Service: 'lambda.amazonaws.com' },
                            Action: 'sts:AssumeRole'
                        }
                    },
                    Policies: [
                        {
                            PolicyName: 'SNS_Policy',
                            PolicyDocument: {
                                Version: '2012-10-17',
                                Statement: {
                                    Effect: 'Allow',
                                    Action: ['sns:*'],
                                    Resource: '*'
                                }
                            }
                        },
                        {
                            PolicyName: 'SQS_Policy',
                            PolicyDocument: {
                                Version: '2012-10-17',
                                Statement: {
                                    Effect: 'Allow',
                                    Action: ['sqs:*'],
                                    Resource: '*'
                                }
                            }
                        }
                    ]
                }
            },
            Unauthorized: {
                Type: 'AWS::ApiGateway::GatewayResponse',
                Properties: {
                    ResponseType: 'DEFAULT_4XX',
                    RestApiId: { Ref: 'ApiGatewayRestApi' },
                    ResponseParameters: {
                        'gatewayresponse.header.Access-Control-Allow-Origin': "'*'",
                        'gatewayresponse.header.Access-Control-Allow-Headers': "'*'",
                        'gatewayresponse.header.Access-Control-Allow-Methods': "'*'"
                    }
                }
            }
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
