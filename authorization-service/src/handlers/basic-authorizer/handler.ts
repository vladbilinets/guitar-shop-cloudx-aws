import { APIGatewayTokenAuthorizerEvent, Handler } from 'aws-lambda';
import { logEvent } from '@lib/utils/log-event';
import generateAuthPolicy from '@lib/utils/generateAuthPolicy';
import { errorResponse } from '@lib/utils/api-responses';
import { ApiBadRequestError, ApiForbiddenError, ApiInternalError } from '@lib/errors';

const basicAuthorizer: Handler = async (event: APIGatewayTokenAuthorizerEvent) => {
    logEvent('basicAuthorizer', event);

    try {
        const { authorizationToken, methodArn } = event;

        if (!authorizationToken) {
            return errorResponse(new ApiBadRequestError);
        }

        const authCredentials = authorizationToken.split(' ')[1];
        const [username, password] = Buffer
            .from(authCredentials, 'base64')
            .toString('utf-8')
            .split(':');

        if (!process.env[username]) {
            return errorResponse(new ApiForbiddenError);
        }

        const effect = process.env[username] === password ? 'Allow' : 'Deny';

        return generateAuthPolicy(authCredentials, effect, methodArn);
    } catch (err) {
        console.error('Error: ', err);
        return errorResponse(new ApiInternalError);
    }
};

export const main = basicAuthorizer;
