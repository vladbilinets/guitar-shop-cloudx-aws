import { handlerPath } from '@lib/utils/handler-resolver';
import schema from '@handlers/create-product/schema';

export default {
    handler: `${handlerPath(__dirname)}/handler.main`,
    events: [
        {
            http: {
                method: 'post',
                path: 'products',
                request: {
                    schemas: {
                        "application/json": schema
                    }
                },
                cors: true
            }
        }
    ]
};
