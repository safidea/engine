import debug from 'debug'
import { ConfigUtils, SchemaUtils } from '@common/server'
import { PageInterfaceSchema } from '@page'

import type { PagesInterface } from '@page'
import type { ConfigInterface } from '@common/server'

const log = debug('page:config')

class PageConfig implements ConfigInterface {
  public enrich(): void {
    const pages = this.get()
    for (const page in pages) {
      log(`enrich config ${page}`)
    }
  }

  public validate(): void {
    const pages = this.get()
    const schema = new SchemaUtils(PageInterfaceSchema)
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
