import { catalogBatchProcess } from './handler';

import AWSMock from 'aws-sdk-mock';
import AWS from 'aws-sdk';
import { SQSEvent } from 'aws-lambda';

const mockEvent = {
  Records: [
    {
      messageId: '1',
      body: JSON.stringify({
        title: 'Product Title 1',
        description: 'Product Description 1',
        count: 1,
        price: 1,
      }),
    },
    {
      messageId: '2',
      body: JSON.stringify({
        title: 'Product Title 2',
        description: 'Product Description 2',
        count: 2,
        price: 2,
      }),
    },
  ],
};

const env = process.env;

beforeAll((done) => {
  process.env = { ...env, SNS_ARN: 'arn::123' };
  done();
});

afterAll(() => {
  process.env = env;
});

describe('catalogBatchProcess', () => {
  it('should execute without errors', async () => {
    const mockEventLength = mockEvent.Records.length;
    const MockConsumedCapacity = [
      {
        TableName: 'Products',
        CapacityUnits: mockEventLength,
        WriteCapacityUnits: mockEventLength,
      },
      {
        TableName: 'Stocks',
        CapacityUnits: mockEventLength,
        WriteCapacityUnits: mockEventLength,
      },
    ];
    const mockPublishToSNS = jest.fn().mockImplementation((_, callback) => {
      callback(undefined, { MessageId: '3' });
    });
    const mockTransactWrite = jest.fn().mockImplementation((_, callback) => {
      callback(undefined, {
        ConsumedCapacity: MockConsumedCapacity,
      });
    });
    AWSMock.setSDKInstance(AWS);
    AWSMock.mock('DynamoDB.DocumentClient', 'transactWrite', mockTransactWrite);
    AWSMock.mock('SNS', 'publish', mockPublishToSNS);

    const result = await catalogBatchProcess(mockEvent as unknown as SQSEvent);

    expect(mockTransactWrite).toBeCalled();
    expect(mockPublishToSNS).toBeCalled();
    expect(result).toEqual({
      statusCode: 200,
      body: JSON.stringify({ message: "success" }),
    });

    AWSMock.restore("DynamoDB.DocumentClient");
    AWSMock.restore("SNS");
  });
});
