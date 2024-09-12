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
  private readonly _name: string
  private _log: (message: string) => void
  private _bucket: Spi

  constructor(
    spi: StorageSpi,
    services: Services,
    private _config: Config
  ) {
    const { name } = _config
    this._log = services.logger.init('bucket')
    this._bucket = spi.bucket(name)
    this._name = name
  }

  exists = async () => {
    return this._bucket.exists()
  }

  create = async () => {
    this._log(`creating ${this._name}...`)
    await this._bucket.create()
  }

  save = async (createdFile: CreatedFile) => {
    this._log(`saving file in ${this._name} ${JSON.stringify(createdFile.toJson())}`)
    await this._bucket.save(createdFile)
    const persistedFile = await this.readByIdOrThrow(createdFile.id)
    return persistedFile
  }

  readById = async (id: string) => {
    this._log(`reading file in ${this._name} ${id}`)
    return this._bucket.readById(id)
  }

  readByIdOrThrow = async (id: string) => {
    const file = await this.readById(id)
    if (!file) throw new Error(`file not found: ${id}`)
    return file
  }
}
