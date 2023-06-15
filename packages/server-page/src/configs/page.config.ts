import debug from 'debug'
import { ConfigUtils, SchemaUtils, ObjectUtils } from 'server-common'
import { PageSchema } from 'shared-page'

import type { PagesInterface } from 'shared-page'
import type { ConfigExecInterface } from 'shared-app'

const log: debug.IDebugger = debug('config:page')

class PageConfig implements ConfigExecInterface {
  private pagesConfig: PagesInterface
  private pagesCached: PagesInterface

  constructor({ configUtils }: { configUtils: ConfigUtils }) {
    this.pagesConfig = configUtils.get('pages') as PagesInterface
    this.pagesCached = configUtils.getCached('pages') as PagesInterface
  }

  public isUpdated() {
    log(`check if config is updated`)
    if (!this.pagesConfig) return false
    return !ObjectUtils.isSame(this.pagesConfig, this.pagesCached)
  }

  public async validateSchema(): Promise<void> {
    const pages = this.pagesConfig
    const schema = new SchemaUtils(PageSchema)
    for (const page in pages) {
      log(`validate schema ${page}`)
      schema.validate(pages[page])
    }
  }
}

export default PageConfig
