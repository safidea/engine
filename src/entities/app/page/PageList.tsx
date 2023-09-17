import { PageContext } from './PageContext'
import { Page } from './Page'
import { AppError } from '../AppError'
import { PageParams } from './PageParams'
import { AppServices, AppConfig } from '../App'

export class PageList {
  public readonly uiDriver: string
  private readonly pages: Page[]

  constructor(pages: PageParams[], services: AppServices, config: AppConfig) {
    this.pages = pages.map((page) => new Page(page, services, config))
    this.uiDriver = services.ui.driverName
  }

  async renderByPath(path: string, context: PageContext): Promise<React.FC> {
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

  getPaths(): string[] {
    return this.pages.map((page) => page.path)
  }

  exist(): boolean {
    return this.pages.length > 0
  }
}
