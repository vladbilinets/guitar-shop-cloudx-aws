import path from 'path';
import dotenv from 'dotenv';
import { AWS } from '@serverless/typescript';

dotenv.config({ path: path.join(__dirname, '../../', '.env') });

const {
    ACCOUNT_ID,
    REGION,
    STAGE,
    IMPORT_BUCKET,
    UPLOAD_DIR,
    PARSED_DIR,
    SQS_CATALOG_QUEUE,
} = process.env;

const config = {
    region: REGION as AWS['provider']['region'],
    stage: STAGE,
    sqs: {
        catalogQueue: {
            name: SQS_CATALOG_QUEUE,
            arn: `arn:aws:sqs:${REGION}:${ACCOUNT_ID}:${SQS_CATALOG_QUEUE}`
        }
    },
    buckets: {
        import: IMPORT_BUCKET
    },
    uploadedDir: UPLOAD_DIR,
    parsedDir: PARSED_DIR
};

export default config;
