import AWSMock from 'aws-sdk-mock';
import AWS from 'aws-sdk';
import { main as catalogBatchProcess } from './handler';
import { SQSRecord } from 'aws-lambda';
import { ProductDTO } from '@lib/types';
import { API_MESSAGES, STATUS_CODES } from '@lib/constants';

type ProductEventRecord = {
    messageId: string;
    body: Omit<ProductDTO, 'id'>;
};
const eventRecords: ProductEventRecord[] = [
    {
        messageId: 'id-1',
        body: {
            title: 'title1',
            description: 'description1',
            price: 1,
            count: 1
        }
    },
    {
        messageId: 'id-2',
        body: {
            title: 'title2',
            description: 'description2',
            price: 2,
            count: 2
        }
    },
];

const mockedCreateProduct = jest.fn().mockImplementation(() => Promise.resolve());
jest.mock('@lib/services/product.service.ts', () => function() {
    return { createProduct: mockedCreateProduct }
});

describe('catalogBatchProcess', () => {

    beforeEach(() => {
        AWSMock.setSDKInstance(AWS);
    });

    afterEach(() => {
        AWSMock.restore('SNS');
        jest.resetAllMocks();
    });

    it('SHOULD handle an event from SQS and publish an event to SNS', async () => {
        const mockedSnsPublish = jest.fn().mockImplementation((_, callback) => callback(undefined, {}));
        AWSMock.mock('SNS', 'publish', mockedSnsPublish);

        const result = await catalogBatchProcess({
            Records: eventRecords.map((record) => ({
                ...record,
                body: JSON.stringify(record.body)
            } as SQSRecord))
        });

        expect(mockedSnsPublish).toBeCalled();
        expect(mockedCreateProduct).toBeCalled();
        expect(result).toMatchObject({
            statusCode: 200,
            body: JSON.stringify({ message: API_MESSAGES.SUCCESS }),
        });
    });

    it('SHOULD return 500 if there is an error', async () => {
        AWSMock.mock('SNS', 'publish', () => {
            throw new Error('500 error');
        });

        const resp = await catalogBatchProcess({ Records: [] });

        expect(resp.statusCode).toEqual(STATUS_CODES.INTERNAL_SERVER_ERROR);
    });
});
