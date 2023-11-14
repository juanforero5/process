import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { HttpRequest } from '@aws-sdk/protocol-http';
import { S3RequestPresigner } from '@aws-sdk/s3-request-presigner';
// eslint-disable-next-line
import { formatUrl } from '@aws-sdk/util-format-url';
import { Hash } from '@aws-sdk/hash-node';
import { parseUrl } from '@aws-sdk/url-parser';
import Boom from '@hapi/boom';
import { MINIO_ACCESS_KEY, MINIO_HOST, MINIO_SECRET_KEY } from '../commons/env.mjs';
import { BUCKET_NAME } from '../commons/constans.mjs';

class MinioService {
  conn = null;

  presigner = null;

  constructor() {
    if (!this.conn) {
      this.conn = new S3Client({
        region: 'us-east-1',
        credentials: {
          accessKeyId: MINIO_ACCESS_KEY,
          secretAccessKey: MINIO_SECRET_KEY,
        },
        endpoint: MINIO_HOST,
        forcePathStyle: true,
      });

      this.presigner = new S3RequestPresigner({
        region: 'us-east-1',
        credentials: {
          accessKeyId: MINIO_ACCESS_KEY,
          secretAccessKey: MINIO_SECRET_KEY,
        },
        sha256: Hash.bind(null, 'sha256'), // In Node.js
      });
    }
  }

  async saveImage(imageBuffer, name) {
    try {
      if (!imageBuffer) {
        throw Boom.badRequest('imageBuffer is required');
      }

      if (!name) {
        throw Boom.badRequest('Image name is required');
      }

      const originalNameParts = name.split('.');

      if (originalNameParts.length !== 2) {
        throw Boom.badRequest('Invalid image name');
      }

      await this.conn.send(new PutObjectCommand({
        Bucket: BUCKET_NAME,
        Key: name,
        Body: imageBuffer,
      }));

      const url = `http://localhost:9000/images/${name}`;
      const s3ObjectUrl = parseUrl(url);
      // eslint-disable-next-line
      const presigndeUrl = await this.presigner.presign(new HttpRequest(s3ObjectUrl),{ expiresIn: 86400 });
      return formatUrl(presigndeUrl);
    } catch (error) {
      throw Boom.isBoom(error) ? error
        : Boom.internal('Error saving image', error);
    }
  }
}

export default MinioService;
