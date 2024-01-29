import type { Drivers } from '@domain/drivers'
import { PuppeteerBrowser } from './PuppeteerBrowser'
import { AjvSchemaValidator } from './AjvSchemaValidator'
import { ExpressServer } from './ExpressServer'
import { DebugLogger } from './DebugLogger'
import { ReactUi } from './ReactUi'
import { SqliteDatabase } from './database/SqliteDatabase'

const logger = new DebugLogger()
const schemaValidator = new AjvSchemaValidator()
const browser = new PuppeteerBrowser()
const server = new ExpressServer(logger)
const ui = new ReactUi()
const database = new SqliteDatabase(logger)

export const drivers: Drivers = {
  schemaValidator,
  browser,
  server,
  logger,
  ui,
  database,
}
