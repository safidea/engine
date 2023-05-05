import debug from 'debug'
import { ConfigUtils, ObjectUtils, SchemaUtils } from '@common/server'
import { ComponentInterfaceSchema } from '@component'

import type { ComponentsInterface } from '@component'
import type { ConfigInterface } from '@common'

const log = debug('component:config')

class ComponentConfig implements ConfigInterface {
  public enrich(): void {
    const components = this.get()
    if (!components || typeof components !== 'object' || ObjectUtils.isEmpty(components)) {
      log('set default components')
    }
  }

  public validate(): void {
    const components = this.get()
    const schema = new SchemaUtils(ComponentInterfaceSchema)
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
