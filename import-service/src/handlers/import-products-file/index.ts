import type { AWS } from '@serverless/typescript';
import { handlerPath } from '@lib/utils/handler-resolver';
import schema from '@handlers/import-products-file/schema';
import config from '@config/index';

const handler: AWS['functions'][keyof AWS['functions']] = {
    handler: `${handlerPath(__dirname)}/handler.main`,
    events: [
        {
            http: {
                method: 'get',
                path: 'import',
                request: schema,
                authorizer: {
                    type: 'token',
                    arn: `arn:aws:lambda:${config.region}:${config.accountId}:function:cloudx-aws--authorization-dev-basicAuthorizer`
                },
                cors: true
            }
        }
    ]
};

export default handler;
