import { Product } from "../types/product";
import mockProducts from '../mocks/mockProducts.json'

export const getMockProducts = async (): Promise<Array<Product>> => {
  return mockProducts;
}
