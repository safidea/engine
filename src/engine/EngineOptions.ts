import { ConverterDrivers } from '@drivers/converter'
import { DatabaseDrivers } from '@drivers/database'
import { FetcherDrivers } from '@drivers/fetcher'
import { LoggerDrivers } from '@drivers/logger'
import { ServerDrivers } from '@drivers/server'
import { StorageDrivers } from '@drivers/storage'
import { TemplaterDrivers } from '@drivers/templater'
import { UIDrivers } from '@entities/services/ui/UIDrivers'

export interface EngineOptions {
  server?: ServerDrivers
  templater?: TemplaterDrivers
  converter?: ConverterDrivers
  storage?: StorageDrivers
  database?: DatabaseDrivers
  fetcher?: FetcherDrivers
  logger?: LoggerDrivers
  ui?: UIDrivers
  folder?: string
  port?: number
  domain?: string
}
