import { formatJSONResponse } from '@libs/api-gateway';
import { getMockProducts } from "@libs/get-data";
import { checkData } from "@libs/check-data";
import { middyfy } from "@libs/lambda";

export const getProductsList = async () => {
  try {
    const products = await getMockProducts();
    checkData(products, 'Products list not found')

    return formatJSONResponse({ products }, 200);
  } catch (error) {
    return formatJSONResponse({ message: error }, 404);
  }
};

export const main = middyfy(getProductsList);
