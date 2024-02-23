import { ApiError } from '@entities/errors/ApiError'
import { File } from '@entities/services/storage/file/File'
import { Bucket } from '@entities/app/bucket/Bucket'
import { App } from '@entities/app/App'
import { IServerRequest } from '@adapters/controllers/server/IServerRequest'

export class BucketValidator {
  constructor(private app: App) {}

  public async validateFileExist(request: IServerRequest, bucket: Bucket): Promise<File> {
    const { filename } = request.params ?? {}
    const file = await this.app.buckets.storage.read(bucket, filename)
    if (!file) throw new ApiError(`file "${filename}" does not exist in bucket ${bucket}`, 404)
    return file
  }
}
