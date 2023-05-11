import { APIGatewayAuthorizerResult, APIGatewayTokenAuthorizerHandler, } from 'aws-lambda';

const generatePolicy = (
  principalId: string,
  effect: string,
  resource: string
): APIGatewayAuthorizerResult => {
  return {
    principalId,
    policyDocument: {
      Version: '2012-10-17',
      Statement: [
        {
          Action: 'execute-api:Invoke',
          Effect: effect,
          Resource: resource,
        },
      ],
    },
  };
};

const basicAuthorizer: APIGatewayTokenAuthorizerHandler = async (event) => {
  const { authorizationToken, methodArn } = event;
  console.log('event >', event);

  const [_, encodedCredentials] = authorizationToken.split(' ');
  const buffer = Buffer.from(encodedCredentials, 'base64');
  const [userName, password] = buffer.toString('utf-8').split(':');

  console.log('>>', 'userName', userName, 'password', password);
  console.log('process.env >>>', JSON.stringify(process.env));

  const storedUserPassword = process.env[userName];

  const effect =
    !storedUserPassword || process.env[userName] !== password
      ? 'Deny'
      : 'Allow';

  console.log('effect', effect);

  return generatePolicy(encodedCredentials, effect, methodArn);
};

export const main = basicAuthorizer;
