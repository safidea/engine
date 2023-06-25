import debug from 'debug'
import { ConfigUtils, SchemaUtils } from 'server-common'
import { ComponentSchema } from 'shared-component'

import type { ComponentsInterface } from 'shared-component'
import type { ConfigExecInterface } from 'shared-app'

const log: debug.IDebugger = debug('config:component')

class ComponentConfig implements ConfigExecInterface {
  private componentsConfig: ComponentsInterface

  constructor({ configUtils }: { configUtils: ConfigUtils }) {
    this.componentsConfig = configUtils.get('components') as ComponentsInterface
  }

  public isUpdated() {
    log(`check if config is updated`)
    return true
  }

  public async validateSchema(): Promise<void> {
    const components = this.componentsConfig
    const schema = new SchemaUtils(ComponentSchema)
    for (const component in components) {
      log(`validate schema ${component}`)
      schema.validate(components[component])
    }
  }
}

export default ComponentConfig
