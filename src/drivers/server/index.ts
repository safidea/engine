import { ExpressServer } from './ExpressServer'

export type ServerDrivers = 'express'
export type ServerDriverOptions = {
  port?: number
}

export function getServerDriver(driver: ServerDrivers = 'express', options: ServerDriverOptions) {
  switch (driver) {
    case 'express':
      return new ExpressServer(options)
    default:
      throw new Error(`Server driver '${driver}' not found`)
  }
}
