import { IConverterService } from '@entities/services/converter/IConverterService'
import { IDatabaseService } from '@entities/services/database/IDatabaseService'
import { IFetcherService } from '@entities/services/fetcher/IFetcherService'
import { ILoggerService } from '@entities/services/logger/ILoggerService'
import { IStorageService } from '@entities/services/storage/IStorageService'
import { ITemplaterService } from '@entities/services/templater/ITemplaterService'
import { IUIService } from '@entities/services/ui/IUIService'

export interface AppServices {
  readonly ui?: IUIService
  readonly fetcher?: IFetcherService
  readonly templater?: ITemplaterService
  readonly converter?: IConverterService
  readonly storage?: IStorageService
  readonly database?: IDatabaseService
  readonly logger?: ILoggerService
}
