import { IStorageSpi } from '@domain/spi/IStorageSpi'
import { IStorageAdapter } from './IStorageAdapter'
import { FileMapper } from './mappers/FileMapper'
import { File } from '@domain/entities/storage/File'

export class StorageSpi implements IStorageSpi {
  constructor(private storageAdapter: IStorageAdapter) {}

  async bucketExists(bucket: string) {
    return this.storageAdapter.bucketExists(bucket)
  }

  async write(bucket: string, file: File) {
    const fileDto = FileMapper.toDto(file)
    const id = await this.storageAdapter.write(bucket, fileDto)
    return id
  }

  async writeMany(bucket: string, files: File[]) {
    const filesDto = FileMapper.toDtos(files)
    return this.storageAdapter.writeMany(bucket, filesDto)
  }

  async list(bucket: string, filenames?: string[]) {
    const filesDto = await this.storageAdapter.list(bucket, filenames)
    return FileMapper.toEntities(filesDto)
  }

  async read(bucket: string, filename: string) {
    const fileDto = await this.storageAdapter.read(bucket, filename)
    if (!fileDto) return undefined
    return FileMapper.toEntity(fileDto)
  }
}
