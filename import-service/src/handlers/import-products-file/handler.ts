import AWS from 'aws-sdk';
import { APIGatewayProxyEvent, Handler } from 'aws-lambda';
import { errorResponse, successResponse } from '@lib/utils/api-responses';
import ApiBadRequestError from '@lib/errors/api-bad-request.error';
import ApiInternalError from '@lib/errors/api-internal.error';
import { API_MESSAGES } from '@lib/constants';
import { logEvent } from '@lib/utils/log-event';
import config from '@config/index';

const importProductsFile: Handler = async (event: APIGatewayProxyEvent) => {
    logEvent('importProductsFile', event);

    try {
        if (!event.queryStringParameters?.name) {
            return errorResponse(new ApiBadRequestError(API_MESSAGES.NAME_IS_NOT_PROVIDED));
        }

        const fileName = event.queryStringParameters.name;

        // Generate a Signed URL for the uploaded file
        const S3 = new AWS.S3({ signatureVersion: 'v4', region: config.region });
        const signedUrl = await S3.getSignedUrlPromise('putObject', {
            Bucket: config.buckets.import,
            Key: `${config.uploadedDir}/${fileName}`,
            Expires: 300 // URL will expire in 5 minutes
        });

        return successResponse(signedUrl);
    } catch (err) {
        console.error(err);
        return errorResponse(
            new ApiInternalError(`${API_MESSAGES.INTERNAL_SERVER_ERROR} (${err.message})`),
            { event }
        );
    }
};

export const main = importProductsFile;
