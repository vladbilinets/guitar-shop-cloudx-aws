import { APIGatewayProxyEvent } from 'aws-lambda';

export function logEvent(eventName: string, event: APIGatewayProxyEvent): void {
    if (process.env.NODE_ENV !== 'test') {
        console.log(`[${(new Date()).toISOString()}] ${eventName}: ${JSON.stringify(event)}`);
    }
}
