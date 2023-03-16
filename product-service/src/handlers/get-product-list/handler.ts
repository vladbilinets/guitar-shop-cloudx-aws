import { APIGatewayProxyEvent, Handler } from 'aws-lambda';
import { errorResponse, successResponse } from '@lib/utils/api-responses';
import ApiInternalError from '@lib/errors/api-internal.error';
import { ProductService } from '@lib/services';
import ApiNotFoundError from '@lib/errors/api-not-found.error';
import { API_MESSAGES } from '@lib/constants';
import { logEvent } from '@lib/utils/log-event';

const getProductList: Handler = async (event: APIGatewayProxyEvent) => {
    logEvent('getProductList', event);

    try {
        const productService = new ProductService();
        const products = await productService.getAll();

        if (!products.length) {
            return errorResponse(new ApiNotFoundError(API_MESSAGES.PRODUCTS_NOT_FOUND));
        }

        return successResponse(products);
    } catch (err) {
        console.error(err);
        return errorResponse(
            new ApiInternalError(`${API_MESSAGES.INTERNAL_SERVER_ERROR} (${err.message})`,),
            { event }
        );
    }
};

export const main = getProductList;
