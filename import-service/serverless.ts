import type { AWS } from '@serverless/typescript';
import { importFileParser, importProductsFile } from '@functions/index';

const serverlessConfiguration: AWS = {
  service: 'import-service',
  frameworkVersion: '3',
  plugins: ['serverless-esbuild'],
  provider: {
    name: 'aws',
    runtime: 'nodejs14.x',
    stage: 'dev',
    region: 'us-east-1',
    apiGateway: {
      minimumCompressionSize: 1024,
      shouldStartNameWithService: true,
    },
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
      NODE_OPTIONS: '--enable-source-maps --stack-trace-limit=1000',
      IMPORT_BUCKET_NAME: '${self:custom.import_bucket_name}',
      SQS_URL: { 'Fn::ImportValue': 'sqsURL' },
    },
    iamRoleStatements: [
      {
        Effect: 'Allow',
        Action: 's3:ListBucket',
        Resource: ['arn:aws:s3:::${self:custom.import_bucket_name}'],
      },
      {
        Effect: 'Allow',
        Action: 's3:*',
        Resource: ['arn:aws:s3:::${self:custom.import_bucket_name}/*'],
      },
      {
        Effect: 'Allow',
        Action: 'sqs:SendMessage',
        Resource: { 'Fn::ImportValue': 'sqsARN' },
      },
    ],
  },
  functions: { importProductsFile, importFileParser },
  package: { individually: true },
  custom: {
    import_bucket_name: 'my-store-import-service',
    esbuild: {
      bundle: true,
      minify: false,
      sourcemap: true,
      exclude: ['aws-sdk'],
      target: 'node14',
      define: { 'require.resolve': undefined },
      platform: 'node',
      concurrency: 10,
    },
  },
  resources: {
    Resources: {
      Unauthorized: {
        Type: 'AWS::ApiGateway::GatewayResponse',
        Properties: {
          ResponseParameters: {
            'gatewayresponse.header.Access-Control-Allow-Origin': "'*'",
            'gatewayresponse.header.Access-Control-Allow-Headers': "'*'",
          },
          ResponseType: 'DEFAULT_4XX',
          RestApiId: { Ref: 'ApiGatewayRestApi' },
        },
      },
    },
  },
};

module.exports = serverlessConfiguration;
