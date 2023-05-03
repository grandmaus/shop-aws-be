import Schema from '@functions/createProduct/schema';
import { formatJSONResponse, ValidatedEventAPIGatewayProxyEvent } from '@libs/api-gateway';
import { middyfy } from '@libs/lambda';
import { v4 as uuidv4 } from 'uuid';
import { getTransactItems, transactWriteProduct } from '@libs/dynamoDBUtils';

export const createProduct: ValidatedEventAPIGatewayProxyEvent<typeof Schema> = async (event) => {
  const {
    title,
    description,
    price,
    count
  } = event.body;

  try {
    await transactWriteProduct(getTransactItems(
      {
        id: uuidv4(),
        title,
        description,
        price,
        count
      }
    ));

    return formatJSONResponse({ message: 'Successfully added' });
  } catch (e) {
    return formatJSONResponse({ message: 'Something went wrong!' }, 500);
  }
}

export const main = middyfy(createProduct);
