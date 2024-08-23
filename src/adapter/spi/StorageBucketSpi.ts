import type { Server } from '@domain/services/Server'
import type { Spi } from '@domain/services/StorageBucket'
import type { PersistedDto, ToSaveDto } from './dtos/FileDto'
import type { ToSave } from '@domain/entities/File/ToSave'
import { FileMapper } from './mappers/FileMapper'

export interface Driver {
  exists: () => Promise<boolean>
  create: () => Promise<void>
  save: (data: ToSaveDto) => Promise<void>
  readById: (id: string) => Promise<PersistedDto | undefined>
}

export interface Services {
  server: Server
}

export class StorageBucketSpi implements Spi {
  constructor(
    private _driver: Driver,
    private _services: Services
  ) {}

  exists = async () => {
    return this._driver.exists()
  }

  create = async () => {
    await this._driver.create()
  }

  save = async (data: ToSave) => {
    const toSaveDto = FileMapper.toSaveDto(data)
    await this._driver.save(toSaveDto)
  }

  readById = async (id: string) => {
    const { server } = this._services
    const persistedDto = await this._driver.readById(id)
    if (!persistedDto) return
    return FileMapper.toPersistedEntity(persistedDto, { server })
  }
}
