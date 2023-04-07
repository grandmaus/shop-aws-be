import type { AWS } from '@serverless/typescript';
import { getProductsById, getProductsList } from "@functions/index";

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
    },
  },
  functions: { getProductsList, getProductsById },
  package: { individually: true },
  custom: {
    webpack: {
      webpackConfig: 'webpack.config.js',
      includeModules: true,
      excludeFiles: 'src/**/handler.ts',
    },
    autoswagger: {
      apiType: 'http',
      typefiles: ['./src/types/api-types.d.ts'],
      basePath: '/dev',
    }
  },
};

module.exports = serverlessConfiguration;
