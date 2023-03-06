import { APIGatewayProxyEvent, Handler } from 'aws-lambda';
import { errorResponse, successResponse } from '@lib/utils/api-responses';
import ApiInternalError from '@lib/errors/api-internal.error';
import { ProductService } from '@lib/services';
import { ProductDTO } from '@lib/types';
import { id } from 'aws-sdk/clients/datapipeline';
import { API_MESSAGES, STATUS_CODES } from '@lib/constants';

const createProduct: Handler = async (event: APIGatewayProxyEvent) => {
    console.log('createProduct', event);

    try {
        const productService = new ProductService();
        const productDto: Omit<ProductDTO, id> = JSON.parse(event.body);

        await productService.createProduct(productDto);

        return successResponse({ message: API_MESSAGES.PRODUCT_CREATED }, STATUS_CODES.CREATED);
    } catch (err) {
        console.error(err);
        return errorResponse(
            new ApiInternalError(`${API_MESSAGES.INTERNAL_SERVER_ERROR} (${err.message})`,),
            { event }
        );
    }
};

export const main = createProduct;
