import { FileDto } from '@adapters/dtos/FileDto'

export interface IStorageDriver {
  upload(bucket: string, buffer: Buffer, file: FileDto): Promise<string>
  uploadMany(bucket: string, buffers: Buffer[], files: FileDto[]): Promise<string[]>
  read(bucket: string, filename: string): Promise<Buffer | undefined>
  list(bucket: string, filenames?: string[]): Promise<Buffer[]>
  readStaticFile(path: string): string
}
