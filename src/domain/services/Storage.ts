import type { Persisted } from '@domain/entities/File/Persisted'
import type { Logger } from './Logger'
import type { ToSave } from '@domain/entities/File/ToSave'
import type { Exec, Query } from './Database'

export interface Config {
  type: 'sqlite' | 'postgres'
  query: Query
  exec: Exec
}

export interface Services {
  logger: Logger
}

export interface Spi {
  start: () => Promise<void>
  save: (data: ToSave) => Promise<void>
  readById: (id: string) => Promise<Persisted | undefined>
}

export class Storage {
  private _log: (message: string) => void

  constructor(
    private _spi: Spi,
    services: Services
  ) {
    this._log = services.logger.init('storage')
  }

  start = async () => {
    this._log('starting storage...')
    await this._spi.start()
    this._log('storage started')
  }

  save = async (toSaveFile: ToSave) => {
    await this._spi.save(toSaveFile)
    const persistedFile = await this.readByIdOrThrow(toSaveFile.id)
    this._log(`save file ${toSaveFile.data.name}`)
    return persistedFile
  }

  readById = async (id: string) => {
    return this._spi.readById(id)
  }

  readByIdOrThrow = async (id: string) => {
    const file = await this.readById(id)
    if (!file) throw new Error(`file not found: ${id}`)
    return file
  }
}
