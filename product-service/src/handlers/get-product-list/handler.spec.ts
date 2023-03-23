import { APIGatewayProxyEvent, Context } from 'aws-lambda';
import { main as getProductList } from '@handlers/get-product-list/handler';
import { ApiGatewayProxyEventFactory } from '@lib/utils/api-gateway-proxy-event-factory';
import { ProductDTO } from '@lib/types';

const productsMock: ProductDTO[] = [
    { id: 'id-1', title: 'Product 1', description: 'Description 1', price: 1, count: 1 },
    { id: 'id-2', title: 'Product 2', description: 'Description 2', price: 2, count: 2 }
];
jest.mock('@lib/services/product.service.ts', () => function() {
    return { getAll: () => Promise.resolve(productsMock) }
});

describe('getProductsList', () => {
    let event: APIGatewayProxyEvent;

    beforeEach(() => {
        jest.resetAllMocks();
        event = ApiGatewayProxyEventFactory({}, {});
    });

    it('SHOULD return all products', async () => {
        const { body } = await getProductList(event, {} as Context, () => {});

        expect(JSON.parse(body)).toMatchObject(productsMock);
    });
});
