import { AWS } from '@serverless/typescript';

const PRODUCTS_TABLE = 'PRODUCTS_TABLE';
const STOCK_TABLE = 'STOCK_TABLE';

const config = {
    region: 'eu-central-1' as AWS['provider']['region'],
    db: {
        tables: {
            products: PRODUCTS_TABLE,
            stock: STOCK_TABLE
        }
    }
};

export default config;
