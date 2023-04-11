import { BatchWriteItemCommand, DynamoDBClient } from '@aws-sdk/client-dynamodb';
import mockProducts from '../mocks/mockProducts.json';
import { convertJSONToBatchWriteParams } from './convert-json-to-batch-params';

const client = new DynamoDBClient({ region: 'us-east-1' });

const params = convertJSONToBatchWriteParams(mockProducts);

client.send(new BatchWriteItemCommand(params)).then(data => {
  console.log('Success', data);
}).catch(error => {
  console.error(error);
});

