import { ApiError } from '@entities/errors/ApiError'
import { File } from '@entities/services/storage/file/File'
import { Bucket } from '@entities/app/bucket/Bucket'
import { App } from '@entities/app/App'
import { ServerRequest } from '@adapters/services/server/ServerRequest'

export class BucketValidator {
  constructor(private app: App) {}

  public async validateFileExist(request: ServerRequest, bucket: Bucket): Promise<File> {
    const { filename } = request.params ?? {}
    const file = await this.app.services.storage.read(bucket, filename)
    if (!file) throw new ApiError(`file "${filename}" does not exist in bucket ${bucket}`, 404)
    return file
  }
}
