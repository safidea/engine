import { App } from '@domain/entities/App'

export class PageMiddleware {
  constructor(private readonly _app: App) {}

  public async pathExists(path: string) {
    const page = this._app.pageExists(path)
    if (!page) {
      throw new Error(`Page ${path} not found`)
    }
    return page
  }
}
