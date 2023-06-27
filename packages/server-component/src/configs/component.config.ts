import debug from 'debug'
import { AppProviderInterface, ConfigUtils, SchemaUtils } from 'server-common'
import { ComponentSchema } from 'shared-component'

import type { ComponentsInterface } from 'shared-component'
import type { ConfigExecInterface } from 'shared-app'

const log: debug.IDebugger = debug('config:component')

class ComponentConfig implements ConfigExecInterface {
  private componentsConfig: ComponentsInterface
  private appProvider: AppProviderInterface

  constructor({
    configUtils,
    appProvider,
  }: {
    configUtils: ConfigUtils
    appProvider: AppProviderInterface
  }) {
    this.appProvider = appProvider
    this.componentsConfig = configUtils.get('components') as ComponentsInterface
  }

  public isUpdated() {
    log(`check if config is updated`)
    return true
  }

  public async validateSchema() {
    const components = this.componentsConfig
    const schema = new SchemaUtils(ComponentSchema)
    for (const component in components) {
      log(`validate schema ${component}`)
      schema.validate(components[component])
    }
  }

  public async buildProviders() {
    log(`build providers`)
    await this.appProvider.buildClientComponents(['list', 'form', 'navigation'])
  }
}

export default ComponentConfig
