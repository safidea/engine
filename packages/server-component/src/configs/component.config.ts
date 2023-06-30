import debug from 'debug'
import { AppProviderInterface, ConfigUtils, SchemaUtils, ObjectUtils } from 'server-common'
import { ComponentSchema } from 'shared-component'

import type { ComponentsInterface } from 'shared-component'
import type { ConfigExecInterface } from 'shared-app'

const log: debug.IDebugger = debug('config:component')

class ComponentConfig implements ConfigExecInterface {
  private componentsConfig: ComponentsInterface
  private appProvider: AppProviderInterface
  private configUtils: ConfigUtils

  constructor({
    configUtils,
    appProvider,
  }: {
    configUtils: ConfigUtils
    appProvider: AppProviderInterface
  }) {
    this.configUtils = configUtils
    this.appProvider = appProvider
    this.componentsConfig = configUtils.get('components') as ComponentsInterface
  }

  public isUpdated(props?: { silent?: boolean }) {
    const { silent = false } = props || {}
    const componentCompiledConfig = this.configUtils.getCompiledConfig(
      'components'
    ) as ComponentsInterface
    const toUpdate = !ObjectUtils.isSame(this.componentsConfig, componentCompiledConfig)
    if (!silent) {
      if (toUpdate) {
        log(`config updated, start execution`)
      } else {
        log(`config not updated, skip`)
      }
    }
    return toUpdate
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
    await this.appProvider.buildClientComponents(['List', 'Form', 'Navigation'])
  }
}

export default ComponentConfig
