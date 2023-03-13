import { APIGatewayProxyEvent } from 'aws-lambda';
import { HttpHeaders } from '@lib/types';

export function ApiGatewayProxyEventFactory(
    body: object,
    pathParameters: object,
    headers: HttpHeaders = {},
    httpMethod = 'GET'
): APIGatewayProxyEvent {
    return {
        httpMethod,
        headers,
        pathParameters,
        body: JSON.stringify(body)
    } as APIGatewayProxyEvent;
}
