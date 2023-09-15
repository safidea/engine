import { File } from './file/File'
import { FileParams } from './file/FileParams'

export interface StorageDriver {
  write(bucket: string, buffer: Buffer, params: FileParams): Promise<string>
  writeMany(bucket: string, files: { data: Buffer; params: FileParams }[]): Promise<string[]>
  read(bucket: string, filename: string): Promise<File | undefined>
  list(bucket: string, filenames?: string[]): Promise<File[]>
  readStaticFile(path: string): string
}
