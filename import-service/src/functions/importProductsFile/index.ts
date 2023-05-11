import { handlerPath } from '@libs/handler-resolver';
import { AWS } from '@serverless/typescript';

const functionConfig: AWS['functions']['string'] = {
  handler: `${handlerPath(__dirname)}/handler.main`,
  events: [
    {
      http: {
        method: 'get',
        path: 'import',
        cors: true,
        request: {
          parameters: {
            querystrings: {
              fileName: true,
            },
          },
        },
        authorizer: {
          name: 'basicAuthorizer',
          arn: { 'Fn::ImportValue': 'authorizerArn' },
          resultTtlInSeconds: 0,
          identitySource: 'method.request.header.Authorization',
          type: 'token',
        },
      },
    },
  ],
};

export default functionConfig;
