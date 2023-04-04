import { getProductsById } from './handler';
import mockProducts from '../../mocks/mockProducts.json';
import { Context } from 'aws-lambda';

describe('getProductsById', () => {
  it('should return a product with equal productId', async () => {
    const res = await getProductsById(
      {
        pathParameters: { productId: '1' },
        httpMethod: 'GET',
        path: 'products/1',
        headers: {
          'Content-Type': 'application/json',
        },
      } as unknown as Parameters<typeof getProductsById>[0],
      {} as Context,
      jest.fn()
    );

    expect(res).toEqual({
      statusCode: 200,
      body: JSON.stringify(mockProducts[0]),
    });
  });

  it('should return 404 error if product is not exists', async () => {
    const res = await getProductsById(
      {
        pathParameters: { productId: '111' },
        httpMethod: 'GET',
        path: 'products/111',
        headers: {
          'Content-Type': 'application/json',
        },
      } as unknown as Parameters<typeof getProductsById>[0],
      {} as Context,
      jest.fn()
    );

    expect(res).toEqual({
      statusCode: 404,
      body: JSON.stringify({ message: "Product not found" }),
    });
  });
});
