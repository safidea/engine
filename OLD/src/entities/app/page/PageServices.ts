import { FetcherService } from '@entities/services/fetcher/FetcherService'
import { IconService } from '@entities/services/icon/IconService'
import { UIService } from '@entities/services/ui/UIService'

export type PageServices = {
  ui: UIService
  fetcher: FetcherService
  icon: IconService
}
