import type { Bucket } from '@domain/entities/Bucket'
import type { Logger } from './Logger'
import { StorageBucket } from './StorageBucket'
import type { Exec, Query } from './Database'
import type { StorageBucketSpi } from '@adapter/spi/StorageBucketSpi'

export interface Config {
  type: 'sqlite' | 'postgres'
  query: Query
  exec: Exec
}

export interface Services {
  logger: Logger
}

export interface Spi {
  connect: () => Promise<void>
  bucket: (name: string) => StorageBucketSpi
}

export class Storage {
  private _log: (message: string) => void

  constructor(
    private _spi: Spi,
    private _services: Services
  ) {
    const { logger } = _services
    this._log = logger.init('storage')
  }

  connect = () => {
    return this._spi.connect()
  }

  bucket = (name: string) => {
    return new StorageBucket(this._spi, this._services, { name })
  }

  migrate = async (buckets: Bucket[]) => {
    this._log(`migrating storage...`)
    for (const bucket of buckets) {
      const bucketStorage = this.bucket(bucket.name)
      const exists = await bucketStorage.exists()
      if (!exists) {
        await bucketStorage.create()
      }
    }
    this._log(`storage migrated`)
  }
}
