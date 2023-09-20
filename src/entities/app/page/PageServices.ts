import { FetcherService } from '@entities/services/fetcher/FetcherService'
import { UIService } from '@entities/services/ui/UIService'

export type PageServices = {
  ui: UIService
  fetcher: FetcherService
}
