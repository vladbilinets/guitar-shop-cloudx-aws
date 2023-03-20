export function logEvent(eventName: string, data: object): void {
    if (process.env.NODE_ENV !== 'test') {
        console.log(`[${(new Date()).toISOString()}] ${eventName}: ${JSON.stringify(data)}`);
    }
}
