import { Injectable } from '@nestjs/common';
import { S3 } from 'aws-sdk';
import { ConfigService } from '@nestjs/config';
import { v4 as uuid } from 'uuid';

@Injectable()
export class FilesService {
  private s3: S3;

  constructor(private readonly configService: ConfigService) {
    this.s3 = new S3({
      accessKeyId: this.configService.get<string>('AWS_ACCESS_KEY_ID'),
      secretAccessKey: this.configService.get<string>('AWS_SECRET_ACCESS_KEY'),
      region: this.configService.get<string>('AWS_REGION'),
    });
  }

  async uploadFile(dataBuffer: Buffer, filename: string): Promise<string> {
    const bucketName = this.configService.get<string>('AWS_PUBLIC_BUCKET_NAME');
    if (!bucketName) {
      throw new Error('AWS bucket name is not configured');
    }

    const uploadResult = await this.s3
      .upload({
        Bucket: bucketName,
        Body: dataBuffer,
        Key: `${uuid()}-${filename}`,
        ACL: 'public-read',
      })
      .promise();

    return uploadResult.Location;
  }

  async deleteFile(url: string): Promise<void> {
    const bucketName = this.configService.get<string>('AWS_PUBLIC_BUCKET_NAME');
    if (!bucketName) {
      throw new Error('AWS bucket name is not configured');
    }

    const key = url.split('/').pop();
    if (!key) {
      throw new Error('Invalid file URL');
    }

    await this.s3
      .deleteObject({
        Bucket: bucketName,
        Key: key,
      })
      .promise();
  }
}