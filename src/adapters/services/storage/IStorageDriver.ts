import { FileDto } from '@adapters/dtos/FileDto'

export interface StorageDriverFile {
  filename: string
  data: Buffer
}

export interface IStorageDriver {
  upload(bucket: string, buffer: Buffer, file: FileDto): Promise<string>
  uploadMany(bucket: string, buffers: Buffer[], files: FileDto[]): Promise<string[]>
  read(bucket: string, filename: string): Promise<StorageDriverFile | undefined>
  list(bucket: string, filenames?: string[]): Promise<StorageDriverFile[]>
  readStaticFile(path: string): string
}
