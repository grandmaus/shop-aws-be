import { Product } from "../types/api-types";
import mockProducts from '../mocks/mockProducts.json'

export const getMockProducts = async (): Promise<Array<Product>> => {
  return mockProducts;
}
