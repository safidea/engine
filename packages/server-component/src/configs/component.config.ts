import debug from 'debug'
import { AppProviderInterface, ConfigUtils, SchemaUtils, ObjectUtils } from 'server-common'
import { ComponentSchema } from 'shared-component'
import Form from './form.config'

import type { ComponentInterface, ComponentsInterface, FormConfig } from 'shared-component'
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

  public async enrichSchema() {
    const enrichComponent = (componentConfig: ComponentInterface) => {
      const { key, components } = componentConfig
      log(`enrich schema ${key}`)
      switch (key) {
        case 'form':
          componentConfig = Form.enrich(componentConfig as FormConfig, this.configUtils.get())
        default:
          break
      }
      if (components?.length > 0) {
        for (let i = 0; i < components.length; i++) {
          componentConfig.components[i] = enrichComponent(components[i])
        }
      }
      return componentConfig
    }
    for (const component in this.componentsConfig) {
      this.componentsConfig[component] = enrichComponent(this.componentsConfig[component])
    }
    this.configUtils.set('components', this.componentsConfig)
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
    await this.appProvider.buildComponents({
      clients: ['Page', 'List', 'Form', 'Navigation', 'Hero', 'Table'],
      servers: ['Default', 'Cta', 'Features', 'Footer', 'Logos', 'Testimonials'],
    })
  }
}

export default ComponentConfig
