import { handlerPath } from '@lib/utils/handler-resolver';

export default {
    handler: `${handlerPath(__dirname)}/handler.main`,
    events: [
        {
            http: {
                method: 'get',
                path: 'products',
                cors: true
            }
        }
    ]
};
