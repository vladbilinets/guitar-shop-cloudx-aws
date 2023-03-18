import AWSMock, { AWSCallback } from 'aws-sdk-mock';
import AWS from 'aws-sdk';
import { main as importProductsFile } from '@handlers/import-products-file/handler';
import { Context } from 'aws-lambda';
import { ApiGatewayProxyEventFactory } from '@lib/utils/api-gateway-proxy-event-factory';
import config from '@config/index';
import { API_MESSAGES, STATUS_CODES } from '@lib/constants';

type S3GetSignedUrlParams = {
    Key: string;
    Bucket: string;
};

describe('importProductsFile', () => {
    beforeEach(() => {
        AWSMock.setSDKInstance(AWS);
    });

    afterEach(() => {
        AWSMock.restore('S3');
    });

    it('SHOULD return a signed URL for S3 bucket', async () => {
        AWSMock.mock('S3', 'getSignedUrl', (
            _,
            params: S3GetSignedUrlParams,
            callback: AWSCallback<null, string>
            ) => callback(null, `url://${params.Key}`)
        );

        const fileName = 'filename.csv';
        const event = ApiGatewayProxyEventFactory({ queryStringParameters: { name: fileName } });
        const resp = await importProductsFile(event, {} as Context, () => {});

        expect(resp.statusCode).toEqual(STATUS_CODES.OK);
        expect(typeof resp.body).toEqual('string');
        expect(resp.body).toEqual(`url://${config.uploadedDir}/${fileName}`);
    });

    it('SHOULD return 400 if name is not provided in query params', async () => {
        const event = ApiGatewayProxyEventFactory({ queryStringParameters: {} });
        const resp = await importProductsFile(event, {} as Context, () => {});

        expect(resp.statusCode).toBe(STATUS_CODES.BAD_REQUEST);
        expect(typeof resp.body).toEqual('string');
        expect(JSON.parse(resp.body)).toMatchObject({ message: API_MESSAGES.NAME_IS_NOT_PROVIDED });
    });

    it('SHOULD return 500 if there is an error', async () => {
        AWSMock.mock('S3', 'getSignedUrl', () => {
            throw new Error('500 error');
        });

        const fileName = 'filename.csv';
        const event = ApiGatewayProxyEventFactory({ queryStringParameters: { name: fileName } });
        const resp = await importProductsFile(event, {} as Context, () => {});

        expect(resp.statusCode).toEqual(STATUS_CODES.INTERNAL_SERVER_ERROR);
    });
});
