import { App } from '@entities/app/App'
import { Page } from '@entities/app/page/Page'
import { PageContext } from '@entities/app/page/PageContext'

export class PageValidator {
  constructor(private app: App) {}

  public pageExists(path: string): Page {
    const page = this.app.pages.getByPath(path)
    if (!page) {
      throw new Error(`Page ${path} not found`)
    }
    return page
  }

  public validateContext(params: { [key: string]: string } = {}): PageContext {
    return new PageContext(params)
  }
}
