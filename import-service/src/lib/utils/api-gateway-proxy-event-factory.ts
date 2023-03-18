import { APIGatewayProxyEvent } from 'aws-lambda';
import { HttpHeaders } from '@lib/types';

type EventParams = {
    body?: object;
    pathParameters?: object;
    queryStringParameters?: object;
}

export function ApiGatewayProxyEventFactory(
    params: EventParams,
    headers: HttpHeaders = {},
    httpMethod = 'GET'
): APIGatewayProxyEvent {
    return {
        httpMethod,
        headers,
        ...params,
        body: JSON.stringify(params.body || {})
    } as APIGatewayProxyEvent;
}
