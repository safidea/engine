import { Context } from './context/Context'
import { Page } from './Page'
import { AppError } from '../AppError'
import { PageParams } from './PageParams'
import { PageServices } from './PageServices'
import { AppConfig } from '../AppConfig'
import { AppServices } from '../AppServices'

export class PageList {
  private readonly pages: Page[]
  readonly services: PageServices

  constructor(pages: PageParams[], services: AppServices, config: AppConfig) {
    const { ui, fetcher } = services
    if (!ui) throw new AppError('UI service is required')
    if (!fetcher) throw new AppError('Fetcher service is required')
    this.services = { ui, fetcher }
    this.pages = pages.map((page) => new Page(page, this.services, config))
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
