import { JsonDatabase } from './JsonDatabase'

export type DatabaseDrivers = 'json'
export type DatabaseOptions = {
  folder?: string
}

export function getDatabaseDriver(driver: DatabaseDrivers = 'json', options: DatabaseOptions) {
  switch (driver) {
    case 'json':
      return new JsonDatabase(options)
    default:
      throw new Error(`Database driver '${driver}' not found`)
  }
}
