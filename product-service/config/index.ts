import { AWS } from '@serverless/typescript';

const ACCOUNT_ID = 214342703654;
const REGION: AWS['provider']['region'] = 'eu-central-1';
const PRODUCTS_TABLE = 'PRODUCTS_TABLE';
const STOCK_TABLE = 'STOCK_TABLE';
const SQS_CATALOG_QUEUE = 'catalogItemsQueue';
const SNS_CREATE_TOPIC = 'createProductTopic';

const config = {
    accountId: ACCOUNT_ID,
    region: REGION,
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
        primary: 'vladbilinets@gmail.com',
        secondary: 'vladyslav_bilynets@epam.com'
    },
    subscriptions: {
        createProduct: 'CreateProductSubscription',
        expensivePosition: 'ExpensivePositionSubscription'
    }
};

export default config;
