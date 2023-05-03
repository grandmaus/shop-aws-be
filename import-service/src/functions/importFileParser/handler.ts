import { S3, SQS } from 'aws-sdk';
import { S3Event } from 'aws-lambda';
import { formatJSONResponse } from '@libs/api-gateway';
import csv from 'csv-parser';

const s3 = new S3({ region: 'us-east-1' });
const SQSInstance = new SQS();

const importFileParser = async (event: S3Event) => {
  await Promise.all(
    event.Records.map(({ s3: { object } }) => {
      const s3Stream = s3
        .getObject({
          Bucket: process.env.IMPORT_BUCKET_NAME,
          Key: object.key,
        })
        .createReadStream();

      return new Promise<void>((resolve, reject) => {
        s3Stream
          .pipe(
            csv({
              headers: ['title', 'description', 'price', 'count'],
              skipLines: 1,
            })
          )
          .on('data', async (data) => {
            await SQSInstance.sendMessage({
              QueueUrl: process.env.SQS_URL,
              MessageBody: JSON.stringify(data),
            }).promise();
          })
          .on('error', (error) => {
            console.log(error);
            reject(error);
          })
          .on('end', async () => {
            await s3
              .copyObject({
                Bucket: process.env.IMPORT_BUCKET_NAME,
                CopySource: `${process.env.IMPORT_BUCKET_NAME}/${object.key}`,
                Key: object.key.replace('uploaded', 'parsed'),
              })
              .promise();

            await s3
              .deleteObject({
                Bucket: process.env.IMPORT_BUCKET_NAME,
                Key: object.key,
              })
              .promise();
            resolve();
          });
      });
    })
  );

  return formatJSONResponse({
    message: 'success',
  });
};

export const main = importFileParser;
