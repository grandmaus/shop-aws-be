import AWSMock from 'aws-sdk-mock';
import AWS from 'aws-sdk';
import { importProductsFile } from './handler';
import { APIGatewayProxyEvent } from 'aws-lambda';

const env = process.env;

beforeAll((done) => {
  process.env = { ...env, IMPORT_BUCKET_NAME: 'my-store-import-service' };
  done();
});

afterAll(() => {
  process.env = env;
  AWSMock.restore('S3');
});

describe('importProductsFile', () => {
  it('should return a signed url which contains file name from query parameters', async () => {
    AWSMock.setSDKInstance(AWS);
    AWSMock.mock(
      'S3',
      'getSignedUrl',
      (_, params: { Key: string }, callback) => {
        callback(null, `signedUrl/${params.Key}`);
      }
    );

    const result = await importProductsFile({
      queryStringParameters: { fileName: 'test.csv' },
    } as unknown as APIGatewayProxyEvent);

    expect(JSON.parse(result.body).signedUrl).toBe(
      `signedUrl/uploaded/test.csv`
    );

    AWSMock.restore('S3');
  });
});
