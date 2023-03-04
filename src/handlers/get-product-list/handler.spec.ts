import { APIGatewayProxyEvent, Context } from 'aws-lambda';
import { productsMock } from '@lib/mocks';
import { main as getProductList } from '@handlers/get-product-list/handler';
import { ApiGatewayProxyEventFactory } from '@lib/utils/api-gateway-proxy-event-factory';

describe('getProductsList', () => {
    let event: APIGatewayProxyEvent;

    beforeEach(() => {
        event = ApiGatewayProxyEventFactory({}, {});
    });

    it('SHOULD return all products', async () => {
        const { body } = await getProductList(event, {} as Context, () => {});

        expect(JSON.parse(body)).toMatchObject(productsMock);
    });
});
