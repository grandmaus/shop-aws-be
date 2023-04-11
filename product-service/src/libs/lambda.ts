import middy from '@middy/core';
import middyJsonBodyParser from '@middy/http-json-body-parser';
import cors from '@middy/http-cors';
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { formatJSONResponse } from '@libs/api-gateway';

export const logger = (): middy.MiddlewareObj<
  APIGatewayProxyEvent,
  APIGatewayProxyResult
  > => ({
  before: async (request) => {
    console.log(`Incoming Request: ${JSON.stringify(request.event)}`);
  },
});

export const errorHandler = (): middy.MiddlewareObj<
    APIGatewayProxyEvent,
    APIGatewayProxyResult
  > => ({
  onError: async (request) => {
    request.response = {
      ...request.response,
      ...formatJSONResponse({ message: '❌Something went wrong' }, 500),
    };
  },
});

export const middyfy = (handler) => {
  return middy(handler)
    .use(errorHandler())
    .use(logger())
    .use(middyJsonBodyParser())
    .use(
      cors({
        headers: '*',
      }));
};

