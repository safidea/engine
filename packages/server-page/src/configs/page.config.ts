import debug from 'debug'
import { ConfigUtils, SchemaUtils } from 'server-common'
import { PageSchema } from 'shared-page'

import type { PagesInterface } from 'shared-page'
import type { ConfigExecInterface } from 'server-common'

const log: debug.IDebugger = debug('config:page')

class PageConfig implements ConfigExecInterface {
  public enrich(): void {
    const pages = this.get()
    for (const page in pages) {
      log(`enrich config ${page}`)
    }
  }

  public validate(): void {
    const pages = this.get()
    const schema = new SchemaUtils(PageSchema)
    for (const page in pages) {
      log(`validate schema ${page}`)
      schema.validate(pages[page])
    }
  }

  public lib(): void {
    const pages = this.get()
    for (const page in pages) {
      log(`setup lib ${page}`)
    }
  }

  public js(): void {
    const pages = this.get()
    for (const page in pages) {
      log(`build js ${page}`)
    }
  }

  private get(): PagesInterface {
    return ConfigUtils.get('pages') as PagesInterface
  }
}

export default new PageConfig()
