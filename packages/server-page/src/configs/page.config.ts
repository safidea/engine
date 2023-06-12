import debug from 'debug'
import { ConfigUtils, SchemaUtils } from 'server-common'
import { PageSchema } from 'shared-page'

import type { PagesInterface } from 'shared-page'
import type { ConfigExecInterface } from 'shared-app'

const log: debug.IDebugger = debug('config:page')

class PageConfig implements ConfigExecInterface {
  private pagesConfig: PagesInterface

  constructor({ configUtils }: { configUtils: ConfigUtils }) {
    this.pagesConfig = configUtils.get('pages') as PagesInterface
  }

  public configExists() {
    log(`check config exists`)
    return this.pagesConfig !== undefined
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
