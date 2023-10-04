import { Context } from './context/Context'
import { Page } from './Page'
import { AppError } from '../AppError'
import { PageParams } from './PageParams'
import { AppConfig } from '../AppConfig'
import { AppMappers } from '../AppMappers'
import { UIService } from '@entities/services/ui/UIService'
import { FetcherService } from '@entities/services/fetcher/FetcherService'
import { PageServices } from './PageServices'
import { IconService } from '@entities/services/icon/IconService'

export class PageList {
  private readonly pages: Page[] = []
  private readonly services?: PageServices

  constructor(pages: PageParams[], mappers: AppMappers, config: AppConfig) {
    if (pages.length > 0) {
      const { ui, fetcher, icon } = mappers
      if (!ui) throw new AppError('UI is required')
      if (!fetcher) throw new AppError('Fetcher is required')
      if (!icon) throw new AppError('Icon is required')
      const services = {
        ui: new UIService(ui),
        fetcher: new FetcherService(fetcher),
        icon: new IconService(icon),
      }
      this.pages = pages.map((page) => new Page(page, services, config))
      this.services = services
    }
  }

  get ui(): UIService {
    if (!this.services) throw new AppError('Services not found')
    return this.services.ui
  }

  get fetcher(): FetcherService {
    if (!this.services) throw new AppError('Services not found')
    return this.services.fetcher
  }

  get icon(): IconService {
    if (!this.services) throw new AppError('Services not found')
    return this.services.icon
  }

  async renderByPath(path: string, context: Context): Promise<React.FC> {
    const page = this.getByPath(path)
    if (!page) throw new AppError('Page not found: ' + path)
    const PageComponent = await page.render(context)
    return PageComponent
  }

  getByPath(path: string): Page | undefined {
    return this.pages.find((page) => page.path === path)
  }

  getAll(): Page[] {
    return this.pages
  }

  exist(): boolean {
    return this.pages.length > 0
  }
}
