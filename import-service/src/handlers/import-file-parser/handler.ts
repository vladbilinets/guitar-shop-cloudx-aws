import AWS from 'aws-sdk';
import csvParser from 'csv-parser';
import { Handler } from 'aws-lambda';
import { S3Event } from 'aws-lambda/trigger/s3';
import { logEvent } from '@lib/utils/log-event';
import config from '@config/index';

const s3MoveFileToParsedDirectory = async (s3: AWS.S3, filepath: string) => {
    const Bucket = config.buckets.import;
    const CopySource = `${config.buckets.import}/${filepath}`;
    const Key = filepath.replace(config.uploadedDir, config.parsedDir);

    await s3.copyObject({ Key, CopySource, Bucket }).promise();
    await s3.deleteObject({ Key: filepath, Bucket }).promise();
}

const importFileParser: Handler = async (event: S3Event) => {
    logEvent('importFileParser', event);

    try {
        const fileKey = event.Records[0].s3.object.key;
        const S3 = new AWS.S3({ signatureVersion: 'v4', region: config.region });
        const SQS = new AWS.SQS();

        // Get the object from S3
        const s3Stream = S3.getObject({
            Bucket: config.buckets.import,
            Key: fileKey,
        }).createReadStream();

        // Parse the CSV file using csv-parser
        await new Promise((resolve, reject) => {
            s3Stream
                .pipe(csvParser())
                .on('data', async (data) => {
                    await SQS.sendMessage({
                        QueueUrl: config.sqsCatalogQueue,
                        MessageBody: JSON.stringify(data)
                    }).promise();
                })
                .on('error', (error) => {
                    reject(`CSV parsing error: ${error}`);
                })
                .on('end', async () => {
                    await s3MoveFileToParsedDirectory(S3, fileKey);
                    resolve('CSV parsing complete.');
                });
        });
    } catch (err) {
        console.error('Error: ', err);
    }
};

export const main = importFileParser;
