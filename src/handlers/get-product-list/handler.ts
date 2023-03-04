import { Handler } from 'aws-lambda';
import { errorResponse, successResponse } from '@lib/utils/api-responses';
import ApiInternalError from '@lib/errors/api-internal.error';
import { ProductService } from '@lib/services';
import ApiNotFoundError from '@lib/errors/api-not-found.error';
import { ERROR_MESSAGES } from '@lib/constants';

const getProductList: Handler = async () => {
    const productService = new ProductService();

    try {
        const products = await productService.getAll();

        if (!products.length) {
            return errorResponse(new ApiNotFoundError(ERROR_MESSAGES.PRODUCTS_NOT_FOUND));
        }

        return successResponse(products);
    } catch (err) {
        console.error(err);
        return errorResponse(new ApiInternalError());
    }
};

export const main = getProductList;
