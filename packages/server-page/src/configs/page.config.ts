import debug from 'debug'
import { ConfigUtils, SchemaUtils, ObjectUtils } from 'server-common'
import { PageSchema } from 'shared-page'

import type { PagesInterface, PageComponentsInterface } from 'shared-page'
import type { ConfigExecInterface } from 'shared-app'
import type { AppProviderInterface } from 'shared-common'
import type { ComponentsInterface } from 'server-component'

const log: debug.IDebugger = debug('config:page')

class PageConfig implements ConfigExecInterface {
  public dependsOn = ['components']
  private pagesConfig: PagesInterface
  private configUtils: ConfigUtils
  private appProvider: AppProviderInterface

  constructor({
    configUtils,
    appProvider,
  }: {
    configUtils: ConfigUtils
    appProvider: AppProviderInterface
  }) {
    this.pagesConfig = configUtils.get('pages') as PagesInterface
    this.configUtils = configUtils
    this.appProvider = appProvider
  }

  public isUpdated(props?: { silent?: boolean }) {
    const { silent = false } = props || {}
    const pagesCached = this.configUtils.getCompiledConfig('pages') as PagesInterface
    const toUpdate = !ObjectUtils.isSame(this.pagesConfig, pagesCached)
    if (!silent) {
      if (toUpdate) {
        log(`config updated, start execution`)
      } else {
        log(`config not updated, skip`)
      }
    }
    return toUpdate
  }

  public async enrichSchema() {
    log(`enrich schema`)
    const pages = this.pagesConfig
    const components = this.configUtils.get('components') as ComponentsInterface
    const enrichComponents = (childComponents: PageComponentsInterface) => {
      for (const childComponent in childComponents) {
        const componentConfig = childComponents[childComponent]
        if (componentConfig.key) {
          const commonConfig = components[componentConfig.key]
          if (commonConfig) {
            childComponents[childComponent] = { ...componentConfig, ...commonConfig }
            const component = childComponents[childComponent]
            if (component.components) {
              childComponents[childComponent].components = enrichComponents(component.components)
            }
          }
        }
      }
      return childComponents
    }
    for (const page in pages) {
      const pageConfig = pages[page]
      if (pageConfig.components) {
        pageConfig.components = enrichComponents(pageConfig.components)
      }
    }
    this.configUtils.set('pages', pages)
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
    const pages = this.pagesConfig
    this.appProvider.buildPages(Object.keys(pages).map((page) => ({ path: page })))
  }
}

export default PageConfig
