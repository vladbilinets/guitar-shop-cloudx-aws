import { handlerPath } from '@lib/utils/handler-resolver';
import config from '@config/index';

export default {
    handler: `${handlerPath(__dirname)}/handler.main`,
    role: 'LambdaExecutorRole',
    events: [
        {
            sqs: {
                arn: config.sqs.catalogQueue.arn,
                batchSize: 5
            }
        }
    ]
};
