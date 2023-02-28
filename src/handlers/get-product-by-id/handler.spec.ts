import { Context } from 'aws-lambda';
import { productsMock } from '@lib/mocks';
import { main as getProductById } from '@handlers/get-product-by-id/handler';
import { ApiGatewayProxyEventFactory } from '@lib/utils/api-gateway-proxy-event-factory';
import { ERROR_MESSAGES, STATUS_CODES } from '@lib/constants';

describe('getProductById', () => {
    it('SHOULD return product by ID', async () => {
        const expectedProduct = productsMock[0];
        const pathParameters: object = { productId: expectedProduct.id };
        const event = ApiGatewayProxyEventFactory({}, pathParameters, {});

        const { body } = await getProductById(event, {} as Context, () => {});

        expect(JSON.parse(body)).toMatchObject(expectedProduct);
    });

    it('SHOULD return error "Bad request" WHEN productId is not passed', async () => {
        const event = ApiGatewayProxyEventFactory({}, {}, {});

        const { success, statusCode, body } = await getProductById(event, {} as Context, () => {});

        expect(success).toEqual(false);
        expect(statusCode).toEqual(STATUS_CODES.BAD_REQUEST);
        expect(JSON.parse(body).message).toEqual(ERROR_MESSAGES.PRODUCT_ID_NOT_PROVIDED);
    });

    it('SHOULD return error "Not found" WHEN productId is not found', async () => {
        const pathParameters: object = { productId: 'non-existing-product-id' };
        const event = ApiGatewayProxyEventFactory({}, pathParameters, {});

        const { success, statusCode, body } = await getProductById(event, {} as Context, () => {});

        expect(success).toEqual(false);
        expect(statusCode).toEqual(STATUS_CODES.NOT_FOUND);
        expect(JSON.parse(body).message).toEqual(ERROR_MESSAGES.PRODUCT_NOT_FOUND);
    });
});
