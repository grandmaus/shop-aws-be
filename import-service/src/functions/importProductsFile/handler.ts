import AWS from 'aws-sdk';
import { formatJSONResponse } from '@libs/api-gateway';
import { middyfy } from '@libs/lambda';
import { APIGatewayProxyEvent } from "aws-lambda";

export const importProductsFile = async (event: APIGatewayProxyEvent) => {
  const s3 = new AWS.S3({ region: 'us-east-1' });
  const { fileName } = event.queryStringParameters;

  const signedUrl = await s3.getSignedUrlPromise('putObject', {
    Bucket: process.env.IMPORT_BUCKET_NAME,
    Expires: 60,
    ContentType: 'text/csv',
    Key: `uploaded/${fileName}`,
  });

  return formatJSONResponse({
    signedUrl,
  });
};

export const main = middyfy(importProductsFile);
