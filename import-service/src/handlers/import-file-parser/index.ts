import type { AWS } from '@serverless/typescript';
import { handlerPath } from '@lib/utils/handler-resolver';
import config from '@config/index';

const handler: AWS['functions'][keyof AWS['functions']] = {
    handler: `${handlerPath(__dirname)}/handler.main`,
    events: [
        {
            s3: {
                bucket: config.buckets.import,
                event: 's3:ObjectCreated:*',
                rules: [
                    {
                        prefix: `${config.uploadedDir}/`,
                        suffix: '.csv'
                    }
                ]
            }
        }
    ]
};

export default handler;
