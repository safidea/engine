import type { Bucket } from '@domain/entities/Bucket'
import type { Logger } from './Logger'
import { StorageBucket } from './StorageBucket'
import type { Database, DatabaseDriverName, DatabaseExec, DatabaseQuery } from './Database'
import type { StorageBucketSpi } from '@adapter/spi/drivers/StorageBucketSpi'

export interface StorageConfig {
  driver: DatabaseDriverName
  query: DatabaseQuery
  exec: DatabaseExec
}

export interface StorageServices {
  logger: Logger
  database: Database
}

export interface IStorageSpi {
  connect: () => Promise<void>
  bucket: (name: string) => StorageBucketSpi
}

export class Storage {
  constructor(
    private _spi: IStorageSpi,
    private _services: StorageServices
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
