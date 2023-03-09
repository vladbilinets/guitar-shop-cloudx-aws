import { APIGatewayProxyEvent, Handler } from 'aws-lambda';
import { errorResponse, successResponse } from '@lib/utils/api-responses';
import ApiInternalError from '@lib/errors/api-internal.error';
import { ProductService } from '@lib/services';
import ApiNotFoundError from '@lib/errors/api-not-found.error';
import ApiBadRequestError from '@lib/errors/api-bad-request.error';
import { API_MESSAGES } from '@lib/constants';
import { logEvent } from '@lib/utils/log-event';

const getProductById: Handler = async (event: APIGatewayProxyEvent) => {
    logEvent('getProductById', event);

    try {
        if (!event?.pathParameters?.productId) {
            return errorResponse(new ApiBadRequestError(API_MESSAGES.PRODUCT_ID_NOT_PROVIDED));
        }

        const productService = new ProductService();
        const product = await productService.getById(event.pathParameters.productId);
        if (!product) {
            return errorResponse(new ApiNotFoundError(API_MESSAGES.PRODUCT_NOT_FOUND));
        }

        return successResponse(product);
    } catch (err) {
        console.error(err);
        return errorResponse(
            new ApiInternalError(`${API_MESSAGES.INTERNAL_SERVER_ERROR} (${err.message})`,),
            { event }
        );
    }
};

export const main = getProductById;
