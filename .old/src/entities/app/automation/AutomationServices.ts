import { ConverterService } from '@entities/services/converter/ConverterService'
import { DatabaseService } from '@entities/services/database/DatabaseService'
import { LoggerService } from '@entities/services/logger/LoggerService'
import { StorageService } from '@entities/services/storage/StorageService'
import { TemplaterService } from '@entities/services/templater/TemplaterService'

export interface AutomationServices {
  database: DatabaseService
  storage: StorageService
  templater: TemplaterService
  converter: ConverterService
  logger: LoggerService
}
