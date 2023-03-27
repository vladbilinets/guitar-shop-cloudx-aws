import path from 'path';
import dotenv from 'dotenv';
import { AWS } from '@serverless/typescript';

dotenv.config({ path: path.join(__dirname, '../../', '.env') });

const {
    REGION,
    STAGE
} = process.env;

const config = {
    region: REGION as AWS['provider']['region'],
    stage: STAGE
};

export default config;
