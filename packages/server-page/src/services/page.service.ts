import { ConfigUtils } from 'server-common'

import type { PagesInterface } from 'shared-page'
import type { ComponentsInterface } from 'server-component'

class PageService {
  private pages = (ConfigUtils.get('pages') ?? {}) as PagesInterface

  getPaths(): string[] {
    return Object.keys(this.pages)
  }

  pathExists(path: string): boolean {
    return this.pages[path] !== undefined
  }

  getMetadata(path: string) {
    if (!this.pathExists(path)) return
    const { title, metadata = {} } = this.pages[path]
    return { title, ...metadata }
  }

  getComponents(path: string): ComponentsInterface | undefined {
    if (!this.pathExists(path)) return
    return this.pages[path].components
  }
}

export default new PageService()
