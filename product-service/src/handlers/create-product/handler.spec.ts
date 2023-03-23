import { Context } from 'aws-lambda';
import { main as createProduct } from '@handlers/create-product/handler';
import { ApiGatewayProxyEventFactory } from '@lib/utils/api-gateway-proxy-event-factory';
import { API_MESSAGES } from '@lib/constants';

jest.mock('@lib/services/product.service.ts', () => function() {
    return { createProduct: () => Promise.resolve() }
});

describe('createProduct', () => {
    beforeEach(() => {
        jest.resetAllMocks();
    });

    it('SHOULD create product', async () => {
        const event = ApiGatewayProxyEventFactory({
            title: 'Product 1',
            description: 'Description 1',
            price: 1,
            count: 1
        }, {});
        const { body } = await createProduct(event, {} as Context, () => {});

        expect(JSON.parse(body)).toMatchObject({ message: API_MESSAGES.PRODUCT_CREATED });
    });
});
