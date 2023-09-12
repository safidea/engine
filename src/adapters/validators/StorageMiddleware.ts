import { RequestDto } from '@entities/drivers/server/RequestDto'
import { ApiError } from '@entities/errors/ApiError'
import { IStorageSpi } from '@entities/drivers/storage/IStorageSpi'
import { File } from '@entities/drivers/storage/File'

export class StorageMiddleware {
  constructor(private storage: IStorageSpi) {}

  public async validateFileExist(request: RequestDto): Promise<File> {
    const { bucket, filename } = request.params ?? {}
    const file = await this.storage.read(bucket, filename)
    if (!file) throw new ApiError(`file "${filename}" does not exist in bucket ${bucket}`, 404)
    return file
  }
}
