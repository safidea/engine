import { IFetcherService } from '@entities/services/fetcher/IFetcherService'
import { IUIService } from '@entities/services/ui/IUIService'

export type PageServices = {
  ui: IUIService
  fetcher: IFetcherService
}
