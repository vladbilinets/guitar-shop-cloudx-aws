import AWS from 'aws-sdk';
import csvParser from 'csv-parser';
import { Handler } from 'aws-lambda';
import { S3Event } from 'aws-lambda/trigger/s3';
import { logEvent } from '@lib/utils/log-event';
import config from '@config/index';

const importFileParser: Handler = async (event: S3Event) => {
    logEvent('importFileParser', event);

    try {
        const S3 = new AWS.S3({ signatureVersion: 'v4', region: config.region });
        const fileKey = event.Records[0].s3.object.key;

        // Get the object from S3
        const s3Stream = S3.getObject({
            Bucket: config.buckets.import,
            Key: fileKey,
        }).createReadStream();

        // Parse the CSV file using csv-parser
        await new Promise((resolve, reject) => {
            s3Stream
                .pipe(csvParser())
                .on('data', (data) => {
                    console.log('CSV item:', data);
                })
                .on('error', (error) => {
                    reject(`CSV parsing error: ${error}`);
                })
                .on('end', () => {
                    resolve('CSV parsing complete.');
                });
        });
    } catch (err) {
        console.error('Error: ', err);
    }
};

export const main = importFileParser;
