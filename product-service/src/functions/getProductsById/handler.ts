import { formatJSONResponse, ValidatedEventAPIGatewayProxyEvent } from '@libs/api-gateway';
import { middyfy } from '@libs/lambda';
import schema from "@functions/getProductsList/schema";
import { getMockProducts } from "@libs/get-data";
import { checkData } from "@libs/check-data";

export const getProductsById: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (event) => {
  try {
    const { productId } = event.pathParameters;
    const products = await getMockProducts();
    const existingProduct = products.find(({ id }) => id === productId);
    checkData(existingProduct, 'Product not found')

    return formatJSONResponse(existingProduct, 200);
  } catch (error) {
    return formatJSONResponse({ message: error.message }, 404);
  }
};

export const main = middyfy(getProductsById);
