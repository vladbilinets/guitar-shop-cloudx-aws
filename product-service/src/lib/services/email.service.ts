import AWS from 'aws-sdk';

export type PublishOptions = {
    subject: string;
    message: string;
    topicArn: string;
    attributes?: Array<{
       name: string;
       value: string;
    }>;
}

export default class EmailService {
    private sns: AWS.SNS;

    constructor() {
        this.sns = new AWS.SNS();
    }

    public async publish(options: PublishOptions): Promise<void> {
        await this.sns.publish({
            Subject: options.subject,
            Message: options.message,
            TopicArn: options.topicArn,
            ...((options.attributes || []).map((attribute) => ({
                [attribute.name]: {
                    DataType: String,
                    StringValue: attribute.value
                }
            })))
        }).promise();
    }
}
