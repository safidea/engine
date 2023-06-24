import debug from 'debug'
import { ConfigUtils, SchemaUtils, ObjectUtils } from 'server-common'
import { PageSchema } from 'shared-page'

import type { PagesInterface } from 'shared-page'
import type { ConfigExecInterface } from 'shared-app'
import type { ServerProviderInterface } from 'shared-common'

const log: debug.IDebugger = debug('config:page')

class PageConfig implements ConfigExecInterface {
  private pagesConfig: PagesInterface
  private pagesCached: PagesInterface
  private serverProvider: ServerProviderInterface

  constructor({
    configUtils,
    serverProvider,
  }: {
    configUtils: ConfigUtils
    serverProvider: ServerProviderInterface
  }) {
    this.pagesConfig = configUtils.get('pages') as PagesInterface
    this.pagesCached = configUtils.getCached('pages') as PagesInterface
    this.serverProvider = serverProvider
  }

  public exists() {
    log(`check if config exists`)
    return !!this.pagesConfig
  }

  public isUpdated() {
    log(`check if config is updated`)
    return !ObjectUtils.isSame(this.pagesConfig, this.pagesCached)
  }

  public async validateSchema() {
    const pages = this.pagesConfig
    const schema = new SchemaUtils(PageSchema)
    for (const page in pages) {
      log(`validate schema ${page}`)
      schema.validate(pages[page])
    }
  }

  public async setupProviders() {
    log(`setup providers`)
  }

  public async buildProviders() {
    log(`setup pages`)
    this.serverProvider.buildPages()
  }
}

export default PageConfig
