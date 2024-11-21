// client-gateway/src/storage/storage.service.ts
import { Injectable, Logger } from '@nestjs/common';
import { DeleteObjectCommand, GetObjectCommand, PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

import { envs } from '@config/index';

@Injectable()
export class StorageService {
  private readonly s3Client = new S3Client({
    region: envs.awsS3Region,
    credentials: {
      accessKeyId: envs.awsAccessKey,
      secretAccessKey: envs.awsSecretAccessKey,
    },
  });
  private readonly logger = new Logger(StorageService.name);

  async uploadFile(fileName: string, file: Buffer) {
    try {
      await this.s3Client.send(
        new PutObjectCommand({
          Bucket: envs.awsS3Bucket,
          Key: fileName,
          Body: file,
        }),
      );
      return fileName
    } catch (error) {
      this.logger.error(error);
      throw 'Ocurrio un problema al subir el archivo';
    }
  }

  async getSignedUrl(fileName: string, contentType: string): Promise<string> {
    try {
      const expiresIn = Number(envs.awsS3UrlExpires);
      const command = new GetObjectCommand({
        Bucket: envs.awsS3Bucket,
        Key: fileName,
        ResponseContentDisposition : 'inline',
        ResponseContentType: contentType
      });
      const signedUrl = await getSignedUrl(this.s3Client, command, { expiresIn });
      return signedUrl;
    } catch (error) {
      this.logger.error(error);
      throw 'Ocurrio un problema al generar la URL firmada';
    }
  }

  async deleteFile(fileName: string): Promise<void> {
    try {
      await this.s3Client.send(
        new DeleteObjectCommand({
          Bucket: envs.awsS3Bucket,
          Key: fileName,
        }),
      );
    } catch (error) {
      this.logger.error(error);
      throw 'Ocurrio un problema al eliminar el archivo';
    }
  }
}