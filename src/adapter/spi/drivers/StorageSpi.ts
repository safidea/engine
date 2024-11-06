import type { Spi } from '@domain/services/Storage'
import { StorageBucketSpi, type Driver as StorageBucketDriver } from './StorageBucketSpi'

export interface Driver {
  connect: () => Promise<void>
  bucket: (name: string) => StorageBucketDriver
}

export class StorageSpi implements Spi {
  constructor(private _driver: Driver) {}

  connect = () => {
    return this._driver.connect()
  }

  bucket = (name: string) => {
    const storageBucketDriver = this._driver.bucket(name)
    return new StorageBucketSpi(storageBucketDriver)
  }
}
