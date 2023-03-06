import { APIGatewayProxyEvent, Handler } from 'aws-lambda';
import { errorResponse, successResponse } from '@lib/utils/api-responses';
import ApiInternalError from '@lib/errors/api-internal.error';
import { ProductService } from '@lib/services';
import ApiNotFoundError from '@lib/errors/api-not-found.error';
import ApiBadRequestError from '@lib/errors/api-bad-request.error';
import { API_MESSAGES } from '@lib/constants';

const getProductById: Handler = async (event: APIGatewayProxyEvent) => {
    console.log('getProductById', event);

    try {
        const productService = new ProductService();
        const { productId } = event?.pathParameters || null;
        if (!productId) {
            return errorResponse(new ApiBadRequestError(API_MESSAGES.PRODUCT_ID_NOT_PROVIDED));
        }

        const product = await productService.getById(productId);
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
