import { formatJSONResponse, ValidatedEventAPIGatewayProxyEvent } from '@libs/api-gateway';
import { middyfy } from '@libs/lambda';
import Schema from './schema';
import { checkData } from '@libs/check-data';
import { queryById } from '@libs/dynamoDBUtils';

export const getProductsById: ValidatedEventAPIGatewayProxyEvent<typeof Schema> = async (event) => {
  try {
    const { productId } = event.pathParameters;
    const [existingProduct, existingStock] = await Promise.all([
      queryById(
        process.env.PRODUCT_TABLE_NAME,
        'id',
        productId
      ),
      queryById(
        process.env.STOCKS_TABLE_NAME,
        'product_id',
        productId
      ),
    ]);
    const count = existingStock ? existingStock.count : 0;
    const productWithStock = {
      ...existingProduct,
      count,
    }
    checkData(existingProduct, 'Product not found');


    return formatJSONResponse(productWithStock, 200);
  } catch (error) {
    return formatJSONResponse({ message: error.message }, 404);
  }
};

export const main = middyfy(getProductsById);
