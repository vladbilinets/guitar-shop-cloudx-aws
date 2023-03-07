import config from '@config/index';
import { DynamoDB } from 'aws-sdk';
import { IEntity } from '@lib/types';
import { Converter, ConditionExpression, TransactWriteItemList } from 'aws-sdk/clients/dynamodb';

export default class DbClient {
    private db: DynamoDB;

    constructor() {
        const AWS = require('aws-sdk');
        AWS.config.update({ region: config.region });
        this.db = new AWS.DynamoDB();
    }
7
    public async insertOne(tableName: string, entity: IEntity): Promise<void> {
        await this.db.putItem({
            TableName: tableName,
            Item: Converter.marshall(entity)
        }).promise();
    }

    public async get<T extends IEntity>(
        tableName: string,
        options: ConditionExpression = ''
    ): Promise<T[]> {
        const dbOutput = await this.db.scan({
            TableName: tableName,
            FilterExpression: options
        }).promise();
        return dbOutput.Items as T[];
    }

    public async getOne<T extends IEntity>(
        tableName: string,
        options: Partial<T>
    ): Promise<T> {
        const dbOutput = await this.db.getItem({
            TableName: tableName,
            Key: Converter.marshall(options)
        }).promise();

        return Converter.unmarshall(dbOutput.Item) as T;
    }

    public async getAll<T extends IEntity>(tableName: string): Promise<T[]> {
        const dbOutput = await this.db.scan({ TableName: tableName }).promise();
        return dbOutput.Items.map((item) => Converter.unmarshall(item)) as T[];
    }

    public async transaction(items: TransactWriteItemList) {
        const transactionRequest = this.db.transactWriteItems({
            TransactItems: items
        });

        transactionRequest.on('extractError', (resp) => {
            console.error(JSON.parse(resp.httpResponse.body.toString()));
        });

        return transactionRequest.promise()
    }
}
