import { File } from '../../../entities/services/storage/file/File'
import { FileParams } from '../../../entities/services/storage/file/FileParams'

export interface IStorageDriver {
  upload(bucket: string, buffer: Buffer, params: FileParams): Promise<string>
  uploadMany(bucket: string, files: { data: Buffer; params: FileParams }[]): Promise<string[]>
  read(bucket: string, filename: string): Promise<File | undefined>
  list(bucket: string, filenames?: string[]): Promise<File[]>
  readStaticFile(path: string): string
}
