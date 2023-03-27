import path from 'path';
import dotenv from 'dotenv';
import { AWS } from '@serverless/typescript';

dotenv.config({ path: path.join(__dirname, '../../', '.env') });

const {
    ACCOUNT_ID,
    STAGE,
    REGION,
    PRODUCTS_TABLE,
    STOCK_TABLE,
    SQS_CATALOG_QUEUE,
    SNS_CREATE_TOPIC,
    PRIMARY_EMAIL,
    SECONDARY_EMAIL
} = process.env;

const config = {
    accountId: ACCOUNT_ID,
    region: REGION as AWS['provider']['region'],
    stage: STAGE,
    sqs: {
        catalogQueue: {
            name: SQS_CATALOG_QUEUE,
            arn: `arn:aws:sqs:${REGION}:${ACCOUNT_ID}:${SQS_CATALOG_QUEUE}`
        }
    },
    sns: {
        createTopic: {
            name: SNS_CREATE_TOPIC,
            arn: `arn:aws:sqs:${REGION}:${ACCOUNT_ID}:${SNS_CREATE_TOPIC}`
        }
    },
    expensiveProductThreshold: 1000,
    db: {
        tables: {
            products: PRODUCTS_TABLE,
            stock: STOCK_TABLE
        }
    },
    email: {
        primary: PRIMARY_EMAIL,
        secondary: SECONDARY_EMAIL
    },
    subscriptions: {
        createProduct: 'CreateProductSubscription',
        expensivePosition: 'ExpensivePositionSubscription'
    }
};

export default config;
