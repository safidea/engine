import { FileDto } from '@adapters/dtos/FileDto'
import { BucketParams } from '@entities/app/bucket/BucketParams'

export interface StorageDriverFile {
  filename: string
  data: Buffer
}

export interface IStorageDriver {
  configure(buckets: BucketParams[]): Promise<void>
  upload(bucket: string, buffer: Buffer, file: FileDto): Promise<string>
  uploadMany(bucket: string, buffers: Buffer[], files: FileDto[]): Promise<string[]>
  read(bucket: string, filename: string): Promise<StorageDriverFile | undefined>
  list(bucket: string, filenames?: string[]): Promise<StorageDriverFile[]>
  readStaticFile(path: string): string
}
