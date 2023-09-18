import { Emit } from '@entities/app/automation/AutomationList'
import { File } from './file/File'
import { Bucket } from '@entities/app/bucket/Bucket'

export interface IStorageService {
  listen(emit: Emit): Promise<void>
  upload(bucket: Bucket, file: File): Promise<string>
  uploadMany(bucket: Bucket, files: File[]): Promise<string[]>
  read(bucket: Bucket, filename: string): Promise<File | undefined>
  list(bucket: Bucket, filenames?: string[]): Promise<File[]>
  readStaticFile(path: string): string
}
