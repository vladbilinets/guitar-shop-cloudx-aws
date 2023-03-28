import type { AWS } from '@serverless/typescript';
import { handlerPath } from '@lib/utils/handler-resolver';

const handler: AWS['functions'][keyof AWS['functions']] = {
    handler: `${handlerPath(__dirname)}/handler.main`,
    events: [
        {
            http: {
                method: 'get',
                path: 'auth'
            }
        }
    ]
};

export default handler;
