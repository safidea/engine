import type { PersistedFile } from '@domain/entities/File/Persisted'
import type { Logger } from './Logger'
import type { CreatedFile } from '@domain/entities/File/Created'
import type { Spi as StorageSpi } from '@domain/services/Storage'

export interface Config {
  name: string
}

export interface Services {
  logger: Logger
}

export interface Spi {
  exists: () => Promise<boolean>
  create: () => Promise<void>
  save: (data: CreatedFile) => Promise<void>
  readById: (id: string) => Promise<PersistedFile | undefined>
}

export class StorageBucket {
  private _log: (message: string) => void
  private _bucket: Spi

  constructor(
    spi: StorageSpi,
    services: Services,
    private _config: Config
  ) {
    this._log = services.logger.init('bucket')
    this._bucket = spi.bucket(_config.name)
  }

  exists = async () => {
    return this._bucket.exists()
  }

  create = async () => {
    this._log(`creating ${this._config.name}...`)
    await this._bucket.create()
  }

  save = async (toSaveFile: CreatedFile) => {
    await this._bucket.save(toSaveFile)
    const persistedFile = await this.readByIdOrThrow(toSaveFile.id)
    this._log(`save file ${toSaveFile.name}`)
    return persistedFile
  }

  readById = async (id: string) => {
    return this._bucket.readById(id)
  }

  readByIdOrThrow = async (id: string) => {
    const file = await this.readById(id)
    if (!file) throw new Error(`file not found: ${id}`)
    return file
  }
}
