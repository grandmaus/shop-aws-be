import { v4 as uuidv4 } from 'uuid';
import { marshall } from '@aws-sdk/util-dynamodb';
import { BatchWriteItemInput } from '@aws-sdk/client-dynamodb';
import { WriteRequest } from '@aws-sdk/client-dynamodb/dist-types/models/models_0';


export const convertJSONToBatchWriteParams = (data: ReadonlyArray<Record<string, string | number >>): BatchWriteItemInput => {
  const productsIds = new Array(data.length).fill(undefined).map(() => uuidv4());

  const writeRequests = data.reduce((acc, item, index) => {
    const marshallItem = marshall(item);

    const product: WriteRequest = {
      PutRequest: {
        Item: {
          ...marshallItem,
          id: { S: productsIds[index] },
        }
      }
    };

    const stock: WriteRequest = {
      PutRequest: {
        Item: {
          product_id: { S: productsIds[index] },
          count: { N: `${index + 1}` },
        }
      }
    };

    acc.Products.push(product);
    acc.Stocks.push(stock);

    return acc;
  }, {Products: [], Stocks: []})

  return {
    RequestItems: writeRequests
  }
}
