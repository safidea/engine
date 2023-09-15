import { Emit } from '@entities/app/automation/AutomationList'
import { FileParams } from './file/FileParams'
import { File } from './file/File'

export interface IStorageService {
  listen(emit: Emit): Promise<void>
  upload(bucket: string, file: File): Promise<string>
  uploadMany(bucket: string, files: File[]): Promise<string[]>
  read(bucket: string, filename: string): Promise<FileParams | undefined>
  list(bucket: string, filenames?: string[]): Promise<FileParams[]>
  readStaticFile(path: string): string
}
