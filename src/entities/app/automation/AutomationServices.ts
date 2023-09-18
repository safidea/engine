import { IConverterService } from '@entities/services/converter/IConverterService'
import { IDatabaseService } from '@entities/services/database/IDatabaseService'
import { ILoggerService } from '@entities/services/logger/ILoggerService'
import { IStorageService } from '@entities/services/storage/IStorageService'
import { ITemplaterService } from '@entities/services/templater/ITemplaterService'

export interface AutomationServices {
  database: IDatabaseService
  storage: IStorageService
  templater: ITemplaterService
  converter: IConverterService
  logger: ILoggerService
}
