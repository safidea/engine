import { File } from './file/File'
import { Bucket } from '@entities/app/bucket/Bucket'
import { BucketList } from '@entities/app/bucket/BucketList'

export interface IStorageMapper {
  configure(buckets: BucketList): Promise<void>
  upload(bucket: Bucket, file: File): Promise<string>
  uploadMany(bucket: Bucket, files: File[]): Promise<string[]>
  read(bucket: Bucket, filename: string): Promise<File | undefined>
  list(bucket: Bucket, filenames?: string[]): Promise<File[]>
  readStaticFile(path: string): string
}
