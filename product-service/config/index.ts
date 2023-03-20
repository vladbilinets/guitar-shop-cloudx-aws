import { AWS } from '@serverless/typescript';

const PRODUCTS_TABLE = 'PRODUCTS_TABLE';
const STOCK_TABLE = 'STOCK_TABLE';

const config = {
    accountId: 214342703654,
    region: 'eu-central-1' as AWS['provider']['region'],
    sqsCatalogQueue: 'catalogItemsQueue',
    snsCreateTopic: 'createProductTopic',
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
