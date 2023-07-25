import { App } from '@domain/entities/App'

export class PageMiddleware {
  constructor(private readonly _app: App) {}

  public async pathExists(path: string) {
    const { pages } = this._app
    const page = pages.find((page) => page.path === path)
    if (!page) throw new Error(`Page ${path} not found`)
    return page
  }
}
