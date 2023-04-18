import { handlerPath } from '@libs/handler-resolver';

export default {
  handler: `${handlerPath(__dirname)}/handler.main`,
  events: [
    {
      http: {
        method: 'get',
        path: 'products',
        cors: true,
        summary: 'List of products',
        description: 'Request all available products',
        responses: {
          200: {
            description: '✅Success',
            bodyType: 'ProductsList',
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
