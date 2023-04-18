import type { AWS } from '@serverless/typescript';
import { createProduct, getProductsById, getProductsList } from '@functions/index';

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
    ],
  },
  functions: {
    getProductsList,
    getProductsById,
    createProduct
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
