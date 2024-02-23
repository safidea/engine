import { Emit } from '@entities/app/automation/AutomationList'
import { File } from '@entities/services/storage/file/File'
import { IStorageMapper } from '@entities/services/storage/IStorageMapper'
import { Bucket } from '@entities/app/bucket/Bucket'
import { BucketList } from '@entities/app/bucket/BucketList'

export class StorageService {
  private emit?: Emit
  private buckets: BucketList | undefined

  constructor(readonly mapper: IStorageMapper) {}

  async configure(buckets: BucketList): Promise<void> {
    await this.mapper.configure(buckets)
  }

  async listen(emit: Emit) {
    this.emit = emit
  }

  async upload(bucket: Bucket, file: File): Promise<string> {
    const path = this.mapper.upload(bucket, file)
    //if (this.emit) await this.emit('file_created', { bucket, path })
    return path
  }

  async uploadMany(bucket: Bucket, files: File[]): Promise<string[]> {
    const paths = await this.mapper.uploadMany(bucket, files)
    //for (const path of paths) if (this.emit) await this.emit('file_created', { bucket, path })
    return paths
  }

  async read(bucket: Bucket, filename: string): Promise<File | undefined> {
    const file = await this.mapper.read(bucket, filename)
    if (!file) return
    return file
  }

  async list(bucket: Bucket, filenames: string[]): Promise<File[]> {
    const files = await this.mapper.list(bucket, filenames)
    return files
  }

  readStaticFile(path: string): string {
    return this.mapper.readStaticFile(path)
  }
}
