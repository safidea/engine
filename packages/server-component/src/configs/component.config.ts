import debug from 'debug'
import { ConfigUtils, SchemaUtils } from 'server-common'
import { ComponentSchema } from 'shared-component'

import type { ComponentsInterface } from 'shared-component'
import type { ConfigInterface } from 'server-common'

const log: debug.IDebugger = debug('config:component')

class ComponentConfig implements ConfigInterface {
  public enrich(): void {
    const components = this.get()
    for (const component in components) {
      log(`enrich ${component}`)
    }
  }

  public validate(): void {
    const components = this.get()
    const schema = new SchemaUtils(ComponentSchema)
    for (const component in components) {
      log(`validate schema ${component}`)
      schema.validate(components[component])
    }
  }

  public lib(): void {
    const components = this.get()
    for (const component in components) {
      log(`setup lib ${component}`)
    }
  }

  public js(): void {
    const components = this.get()
    for (const component in components) {
      log(`build js ${component}`)
    }
  }

  private get(): ComponentsInterface {
    return ConfigUtils.get('components') as ComponentsInterface
  }
}

export default new ComponentConfig()
