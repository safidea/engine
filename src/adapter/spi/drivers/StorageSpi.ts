import type { IStorageSpi } from '@domain/services/Storage'
import { StorageBucketSpi, type IStorageBucketDriver } from './StorageBucketSpi'

export interface IStorageDriver {
  connect: () => Promise<void>
  bucket: (name: string) => IStorageBucketDriver
}

export class StorageSpi implements IStorageSpi {
  constructor(private _driver: IStorageDriver) {}

  connect = () => {
    return this._driver.connect()
  }

  bucket = (name: string) => {
    const storageBucketDriver = this._driver.bucket(name)
    return new StorageBucketSpi(storageBucketDriver)
  }
}
