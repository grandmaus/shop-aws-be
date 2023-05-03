import { DynamoDB } from 'aws-sdk';
import { TransactWriteItemList } from 'aws-sdk/clients/dynamodb';

const dynamo = new DynamoDB.DocumentClient();

export const scan = async (tableName: string) => {
  const scanResults = await dynamo
    .scan({
      TableName: tableName,
    })
    .promise();
  return scanResults.Items;
};

export const queryById = async (tableName: string, key: string, id: string) => {
  const queryResults = await dynamo
    .query({
      TableName: tableName,
      KeyConditionExpression: `${key} = :id`,
      ExpressionAttributeValues: { ':id': id },
    })
    .promise();

  return queryResults.Items[0];
};

export const transactWriteProduct = (transactItems: TransactWriteItemList) =>
  dynamo
    .transactWrite({
      TransactItems: transactItems,
    })
    .promise();

export const getTransactItems = ({
   id,
   title,
   description,
   price,
   count,
 }): TransactWriteItemList => [
    {
      Put: {
        TableName: process.env.PRODUCT_TABLE_NAME,
        Item: {
          id,
          title,
          description,
          price,
        },
      },
    },
    {
      Put: {
        TableName: process.env.STOCKS_TABLE_NAME,
        Item: {
          product_id: id,
          count,
        },
      },
    },
  ];

