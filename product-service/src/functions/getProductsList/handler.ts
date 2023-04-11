import { formatJSONResponse } from '@libs/api-gateway';
import { checkData } from '@libs/check-data';
import { middyfy } from '@libs/lambda';
import { scan } from '@libs/dynamoDBUtils';

export const getProductsList = async () => {
  try {
    const [productsTable, stocksTable] = await Promise.all([
      scan(process.env.PRODUCT_TABLE_NAME),
      scan(process.env.STOCKS_TABLE_NAME)
    ]);
    checkData(productsTable, 'Products list not found');

    const products = productsTable.reduce((acc, product) => {
      const matchingStock = stocksTable.find(stock => stock.product_id === product.id);
      const count = matchingStock ? matchingStock.count : 0;

      acc.push({...product, count});

      return acc;
    }, []);


    return formatJSONResponse({ products }, 200);
  } catch (error) {
    return formatJSONResponse({ message: error.message }, 404);
  }
};

export const main = middyfy(getProductsList);
