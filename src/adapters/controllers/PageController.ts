import { App } from '@entities/app/App'
import { PageContext } from '@entities/app/page/PageContext'
export class PageController {
  constructor(private readonly app: App) {}

  async render(path: string, params: { [key: string]: string }) {
    const pageContext = new PageContext(params)
    return this.app.pages.render(path, pageContext)
  }
}
