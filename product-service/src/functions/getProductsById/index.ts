import { handlerPath } from '@libs/handler-resolver';

export default {
  handler: `${handlerPath(__dirname)}/handler.main`,
  events: [
    {
      http: {
        method: 'get',
        path: 'products/{productId}',
        cors: true,
        summary: 'Product by Id',
        description: 'Request available product by Id',
        responses: {
          200: {
            description: '✅Success',
            bodyType: 'Product',
          },
          404: {
            description: '❌There is no product  in a table',
            bodyType: 'Error',
          },
          500: {
            description: '❌Server error',
            bodyType: 'Error',
          },
        },
      },
    },
  ],
};
