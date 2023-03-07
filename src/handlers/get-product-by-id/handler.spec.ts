import { Context } from 'aws-lambda';
import { main as getProductById } from '@handlers/get-product-by-id/handler';
import { ApiGatewayProxyEventFactory } from '@lib/utils/api-gateway-proxy-event-factory';
import { API_MESSAGES, STATUS_CODES } from '@lib/constants';
import { ProductDTO } from '@lib/types';

const productMock: ProductDTO = { id: 'id-1', title: 'Product 1', description: 'Description 1', price: 1, count: 1 };
jest.mock('@lib/services/product.service.ts', () => ({
    default: function () {
        return { getById: (id: string) => Promise.resolve(id === productMock.id ? productMock : null) }
    }
}));

describe('getProductById', () => {
    beforeEach(() => {
        jest.resetAllMocks();
    });

    it('SHOULD return product by ID', async () => {
        const pathParameters: object = { productId: productMock.id };
        const event = ApiGatewayProxyEventFactory({}, pathParameters, {});

        const { body } = await getProductById(event, {} as Context, () => {});

        expect(JSON.parse(body)).toMatchObject(productMock);
    });

    it('SHOULD return error "Bad request" WHEN productId is not passed', async () => {
        const event = ApiGatewayProxyEventFactory({}, {}, {});

        const { statusCode, body } = await getProductById(event, {} as Context, () => {});

        expect(statusCode).toEqual(STATUS_CODES.BAD_REQUEST);
        expect(JSON.parse(body).message).toEqual(API_MESSAGES.PRODUCT_ID_NOT_PROVIDED);
    });

    it('SHOULD return error "Not found" WHEN productId is not found', async () => {
        const pathParameters: object = { productId: 'non-existing-product-id' };
        const event = ApiGatewayProxyEventFactory({}, pathParameters, {});

        const { statusCode, body } = await getProductById(event, {} as Context, () => {});

        expect(statusCode).toEqual(STATUS_CODES.NOT_FOUND);
        expect(JSON.parse(body).message).toEqual(API_MESSAGES.PRODUCT_NOT_FOUND);
    });
});
