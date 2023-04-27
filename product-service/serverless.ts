import type { AWS } from '@serverless/typescript';
import {
  catalogBatchProcess,
  createProduct,
  getProductsById,
  getProductsList
} from '@functions/index';

const serverlessConfiguration: AWS = {
  service: 'product-service',
  frameworkVersion: '3',
  plugins: ['serverless-webpack', 'serverless-auto-swagger'],
  provider: {
    name: 'aws',
    runtime: 'nodejs16.x',
    stage: 'dev',
    region: 'us-east-1',
    apiGateway: {
      minimumCompressionSize: 1024,
      shouldStartNameWithService: true,
    },
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
      NODE_OPTIONS: '--enable-source-maps --stack-trace-limit=1000',
      PRODUCT_TABLE_NAME: '${self:custom.products_table_name}',
      STOCKS_TABLE_NAME: '${self:custom.stocks_table_name}',
      SQS_URL: { Ref: 'catalogItemsQueue' },
      SNS_ARN: { Ref: 'createProductTopic' },
    },
    iamRoleStatements: [
      {
        Effect: 'Allow',
        Action: [
          'dynamodb:Query',
          'dynamodb:Scan',
          'dynamodb:GetItem',
          'dynamodb:PutItem',
          'dynamodb:UpdateItem',
          'dynamodb:DeleteItem',
        ],
        Resource: [
          '${self:custom.arn_table_path}/${self:custom.products_table_name}',
          '${self:custom.arn_table_path}/${self:custom.stocks_table_name}',
        ],
      },
      {
        Effect: 'Allow',
        Action: 'sqs:*',
        Resource: { 'Fn::GetAtt': ['catalogItemsQueue', 'Arn'] },
      },
      {
        Effect: 'Allow',
        Action: 'sns:*',
        Resource: { Ref: 'createProductTopic' },
      },
    ],
  },
  resources: {
    Resources: {
      catalogItemsQueue: {
        Type: 'AWS::SQS::Queue',
        Properties: {
          QueueName: 'catalogItemsQueue',
        },
      },
      createProductTopic: {
        Type: 'AWS::SNS::Topic',
        Properties: {
          TopicName: 'createProductTopic',
        },
      },
      createProductSubscription: {
        Type: 'AWS::SNS::Subscription',
        Properties: {
          Protocol: 'email',
          Endpoint: 'andrey_astrouski@epam.com',
          TopicArn: {
            Ref: 'createProductTopic',
          },
        },
      },
      filterPolicySubscription: {
        Type: 'AWS::SNS::Subscription',
        Properties: {
          Protocol: 'email',
          FilterPolicy: {
            high_price: ['true'],
          },
          Endpoint: 'andruxa0286@gmail.com',
          TopicArn: {
            Ref: 'createProductTopic',
          },
        },
      },
    },
    Outputs: {
      sqsURL: {
        Description: 'SQS URL',
        Value: { Ref: 'catalogItemsQueue' },
        Export: { Name: 'sqsURL' },
      },
      sqsARN: {
        Description: 'SQS ARN',
        Value: { 'Fn::GetAtt': ['catalogItemsQueue', 'Arn'] },
        Export: { Name: 'sqsARN' },
      },
    },
  },
  functions: {
    getProductsList,
    getProductsById,
    createProduct,
    catalogBatchProcess,
  },
  package: { individually: true },
  custom: {
    products_table_name: 'Products',
    stocks_table_name: 'Stocks',
    arn_table_path: 'arn:aws:dynamodb:us-east-1:144335490358:table',
    webpack: {
      webpackConfig: 'webpack.config.js',
      includeModules: true,
    },
    autoswagger: {
      apiType: 'http',
      typefiles: ['./src/types/api-types.d.ts'],
      basePath: '/dev',
    }
  },
};

module.exports = serverlessConfiguration;
