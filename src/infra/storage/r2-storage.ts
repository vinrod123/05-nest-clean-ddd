import {
  UploadParams,
  Uploader,
} from '@/domain/forum/application/storage/uploader'

import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3'
import { Injectable } from '@nestjs/common'
import { EnvService } from '../env/env.service'
import { randomUUID } from 'node:crypto'

@Injectable()
export class R2Storage implements Uploader {
  private client: S3Client

  constructor(private envService: EnvService) {
    const accountId = envService.get('CLOUDFLARE_ACCOUNT_ID')

    // Configuração diferente para teste vs produção
    const isTest = process.env.NODE_ENV === 'test'

    if (isTest) {
      // Para testes, usa mock interno
      console.log('R2Storage: Using test configuration')
    }

    this.client = new S3Client({
      endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
      region: 'auto',
      credentials: {
        accessKeyId: envService.get('AWS_ACCESS_KEY_ID'),
        secretAccessKey: envService.get('AWS_SECRET_ACCESS_KEY'),
      },
      forcePathStyle: true,
      // Só aplica configuração SSL em teste
      ...(isTest && {
        requestHandler: {
          httpsAgent: {
            rejectUnauthorized: false,
            checkServerIdentity: () => undefined,
          },
        },
      }),
    })
  }

  async upload({
                 fileName,
                 fileType,
                 body,
               }: UploadParams): Promise<{ url: string }> {
    const uploadId = randomUUID()
    const uniqueFileName = `${uploadId}-${fileName}`

    await this.client.send(
      new PutObjectCommand({
        Bucket: this.envService.get('AWS_BUCKET_NAME'),
        Key: uniqueFileName,
        ContentType: fileType,
        Body: body,
      }),
    )

    return {
      url: uniqueFileName,
    }
  }
}