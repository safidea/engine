import type { IStorageBucketSpi } from '@domain/services/StorageBucket'
import type { FileDto } from '../dtos/FileDto'
import type { CreatedFile } from '@domain/entities/File/Created'
import { FileMapper } from '../mappers/FileMapper'

export interface IStorageBucketDriver {
  exists: () => Promise<boolean>
  create: () => Promise<void>
  save: (data: FileDto) => Promise<void>
  readById: (id: string) => Promise<FileDto | undefined>
}

export class StorageBucketSpi implements IStorageBucketSpi {
  constructor(private _driver: IStorageBucketDriver) {}

  exists = async () => {
    return this._driver.exists()
  }

  create = async () => {
    await this._driver.create()
  }

  save = async (createdFile: CreatedFile) => {
    const createdFileDto = FileMapper.toCreatedDto(createdFile)
    await this._driver.save(createdFileDto)
  }

  readById = async (id: string) => {
    const persistedDto = await this._driver.readById(id)
    if (!persistedDto) return
    return FileMapper.toPersistedEntity(persistedDto)
  }
}
