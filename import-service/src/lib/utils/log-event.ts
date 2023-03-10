import { APIGatewayProxyEvent } from 'aws-lambda';
import { S3Event } from 'aws-lambda/trigger/s3';

export function logEvent(eventName: string, event: APIGatewayProxyEvent | S3Event | object): void {
    if (process.env.NODE_ENV !== 'test') {
        console.log(`[${(new Date()).toISOString()}] ${eventName}: ${JSON.stringify(event)}`);
    }
}
