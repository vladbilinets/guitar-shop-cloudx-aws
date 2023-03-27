import config from '@config/index';
import { SQSEvent } from 'aws-lambda';
import { errorResponse, successResponse } from '@lib/utils/api-responses';
import { logEvent } from '@lib/utils/log-event';
import { ProductService } from '@lib/services';
import { ProductDTO } from '@lib/types';
import ApiInternalError from '@lib/errors/api-internal.error';
import { API_MESSAGES } from '@lib/constants';
import EmailService from '@lib/services/email.service';

export const catalogBatchProcess = async (event: SQSEvent) => {
    logEvent('catalogBatchProcess', event);

    try {
        const products: ProductDTO[] = event.Records.map(
            ({ body }) => JSON.parse(body) as ProductDTO
        );

        // Create products
        const productService = new ProductService();
        await Promise.all(products.map(productService.createProduct.bind(productService)));

        // Send emails
        const emailService = new EmailService();
        await emailService.publish({
            subject: 'Products added successfully',
            message: `${products.length} successfully added`,
            topicArn: config.sns.createTopic.arn,
            attributes: [
                {
                    name: 'ExpensivePosition',
                    value: String(products.some(({ price }) => price >= 2))
                }
            ]
        });

        return successResponse({ message: API_MESSAGES.SUCCESS });
    } catch (err) {
        return errorResponse(new ApiInternalError(`Error during catalog batch process event (${err.message})`));
    }
};

export const main = catalogBatchProcess;
