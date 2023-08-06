import { App } from '@domain/entities/app/App'

export class PageMiddleware {
  constructor(private app: App) {}

  public async pageExists(path: string) {
    return this.app.getPageByPath(path)
  }
}
