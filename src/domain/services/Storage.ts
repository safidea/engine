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
  private _buckets: StorageBucket[] = []

  constructor(
    private _spi: IStorageSpi,
    private _services: StorageServices
  ) {}

  connect = () => {
    this._services.logger.debug(`connecting storage...`)
    return this._spi.connect()
  }

  bucket = (name: string) => {
    let bucket = this._buckets.find((bucket) => bucket.name === name)
    if (bucket) return bucket
    bucket = new StorageBucket(this._spi, this._services, { name })
    this._buckets.push(bucket)
    return bucket
  }

  migrate = async () => {
    const { logger } = this._services
    logger.debug(`migrating storage...`)
    for (const bucket of this._buckets) {
      const bucketStorage = this.bucket(bucket.name)
      const exists = await bucketStorage.exists()
      if (!exists) {
        await bucketStorage.create()
      }
    }
  }
}
