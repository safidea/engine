import { IConverterMapper } from '@entities/services/converter/IConverterMapper'
import { IDatabaseMapper } from '@entities/services/database/IDatabaseMapper'
import { IFetcherMapper } from '@entities/services/fetcher/IFetcherMapper'
import { ILoggerMapper } from '@entities/services/logger/ILoggerMapper'
import { IStorageMapper } from '@entities/services/storage/IStorageMapper'
import { ITemplaterMapper } from '@entities/services/templater/ITemplaterMapper'
import { IUIMapper } from '@entities/services/ui/IUIMapper'

export interface AppMappers {
  readonly ui?: IUIMapper
  readonly fetcher?: IFetcherMapper
  readonly templater?: ITemplaterMapper
  readonly converter?: IConverterMapper
  readonly storage?: IStorageMapper
  readonly database?: IDatabaseMapper
  readonly logger?: ILoggerMapper
}
