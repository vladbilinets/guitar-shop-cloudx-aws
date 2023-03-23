import AWS from 'aws-sdk';
import config from '@config/index';
import { SQSEvent } from 'aws-lambda';
import { errorResponse, successResponse } from '@lib/utils/api-responses';
import { logEvent } from '@lib/utils/log-event';
import { ProductService } from '@lib/services';
import { ProductDTO } from '@lib/types';
import ApiInternalError from '@lib/errors/api-internal.error';
import { API_MESSAGES } from '@lib/constants';

export const catalogBatchProcess = async (event: SQSEvent) => {
    logEvent('catalogBatchProcess', event);

    try {
        const productService = new ProductService();
        const products: ProductDTO[] = event.Records.map(
            ({ body }) => JSON.parse(body) as ProductDTO
        );

        // Create products
        await Promise.all(products.map(productService.createProduct.bind(productService)));

        // Send emails
        const sns = new AWS.SNS();
        await sns.publish({
            Subject: 'Products added successfully',
            Message: `${products.length} successfully added`,
            MessageAttributes: {
                ExpensivePosition: {
                    DataType: 'String',
                    StringValue: String(products.some(({ price }) => price >= 2))
                }
            },
            TopicArn: config.snsCreateTopic
        })
        .promise();


        return successResponse({ message: API_MESSAGES.SUCCESS });
    } catch (err) {
        return errorResponse(new ApiInternalError(`Error during catalog batch process event (${err.message})`));
    }
};

export const main = catalogBatchProcess;
