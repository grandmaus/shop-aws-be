import { getProductsList } from './handler';
import mockProducts from '../../mocks/mockProducts.json';

describe('getProductsList', () => {
  it('should return a list of mocked products', async () => {
    const res = await getProductsList();

    expect(res).toEqual({
      statusCode: 200,
      body: JSON.stringify({ products: mockProducts }),
    });
  });
});
