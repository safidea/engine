import { FileDto } from './dtos/FileDto'

export interface IStorageAdapter {
  bucketExists(bucket: string): boolean
  write(bucket: string, record: FileDto): Promise<string>
  writeMany(bucket: string, record: FileDto[]): Promise<string[]>
  list(bucket: string, filenames?: string[]): Promise<FileDto[]>
  read(bucket: string, filename: string): Promise<FileDto | undefined>
}
