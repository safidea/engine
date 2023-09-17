import { LocalStorage } from './LocalStorage'

export type StorageDrivers = 'local'
export type StorageDriverOptions = {
  folder?: string
  domain?: string
}

export function getStorageDriver(storage: StorageDrivers = 'local', options: StorageDriverOptions) {
  switch (storage) {
    case 'local':
      return new LocalStorage(options)
    default:
      throw new Error(`Storage driver '${storage}' not found`)
  }
}
