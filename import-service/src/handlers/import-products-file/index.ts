import type { AWS } from '@serverless/typescript';
import { handlerPath } from '@lib/utils/handler-resolver';
import schema from '@handlers/import-products-file/schema';

const handler: AWS['functions'][keyof AWS['functions']] = {
    handler: `${handlerPath(__dirname)}/handler.main`,
    events: [
        {
            http: {
                method: 'get',
                path: 'import',
                cors: false,
                request: schema
            }
        }
    ]
};

export default handler;
