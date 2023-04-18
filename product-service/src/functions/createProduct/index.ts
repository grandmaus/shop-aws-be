import { handlerPath } from '@libs/handler-resolver';
import Schema from './schema';

export default {
  handler: `${handlerPath(__dirname)}/handler.main`,
  events: [
    {
      http: {
        method: 'post',
        path: 'products',
        cors: true,
        summary: 'Create Product',
        description: 'Add a new product',
        bodyType: 'ProductPost',
        request: {
          schemas: {
            'application/json': JSON.stringify(Schema),
          },
        },
        responses: {
          200: {
            description: '✅Product added successfully',
            bodyType: 'InfoResponse',
          },
          400: {
            description: '❌Product data is invalid',
            bodyType: 'Error',
          },
          500: {
            description: '❌Server error',
            bodyType: 'Error',
          },
        },
      }
    },
  ],
};
