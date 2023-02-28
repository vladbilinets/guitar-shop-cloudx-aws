import { APIGatewayProxyEvent, Handler } from 'aws-lambda';
import { errorResponse, successResponse } from '@lib/utils/api-responses';
import ApiInternalError from '@lib/errors/api-internal.error';
import { ProductService } from '@lib/services';
import ApiNotFoundError from '@lib/errors/api-not-found.error';
import ApiBadRequestError from '@lib/errors/api-bad-request.error';
import { ERROR_MESSAGES } from '@lib/constants';

const getProductById: Handler = async (event: APIGatewayProxyEvent) => {
    const productService = new ProductService();

    try {
        const { productId } = event.pathParameters;
        if (!productId) {
            return errorResponse(new ApiBadRequestError(ERROR_MESSAGES.PRODUCT_ID_NOT_PROVIDED));
        }

        const product = await productService.getById(productId);
        if (!product) {
            return errorResponse(new ApiNotFoundError(ERROR_MESSAGES.PRODUCT_NOT_FOUND));
        }

        return successResponse(product);
    } catch (err) {
        console.error(err);
        return errorResponse(new ApiInternalError());
    }
};

export const main = getProductById;
