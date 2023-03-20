import { handlerPath } from '@lib/utils/handler-resolver';
import config from '@config/index';

export default {
    handler: `${handlerPath(__dirname)}/handler.main`,
    events: [
        {
            sqs: {
                arn: { 'Fn::GetAtt': [config.sqsCatalogQueue, 'Arn'] },
                batchSize: 5
            }
        }
    ]
};
