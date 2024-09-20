import type { Bucket } from '@domain/entities/Bucket'
import type { Logger } from './Logger'
import { StorageBucket } from './StorageBucket'
import type { Database, Driver, Exec, Query } from './Database'
import type { StorageBucketSpi } from '@adapter/spi/StorageBucketSpi'

export interface Config {
  driver: Driver
  query: Query
  exec: Exec
}

export interface Services {
  logger: Logger
  database: Database
}

export interface Spi {
  connect: () => Promise<void>
  bucket: (name: string) => StorageBucketSpi
}

export class Storage {
  constructor(
    private _spi: Spi,
    private _services: Services
  ) {}

  connect = () => {
    this._services.logger.debug(`connecting storage...`)
    return this._spi.connect()
  }

  bucket = (name: string) => {
    return new StorageBucket(this._spi, this._services, { name })
  }

  migrate = async (buckets: Bucket[]) => {
    const { logger } = this._services
    logger.debug(`migrating storage...`)
    for (const bucket of buckets) {
      const bucketStorage = this.bucket(bucket.name)
      const exists = await bucketStorage.exists()
      if (!exists) {
        await bucketStorage.create()
      }
    }
  }
}
