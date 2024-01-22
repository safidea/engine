import type { ConfigError } from '../ConfigError'
import type { IEntity } from '../IEntity'
import { ComponentList } from '../component/ComponentList'
import { FeatureList } from '../feature/FeatureList'
import { RoleList } from '../role/RoleList'
import type { IApp } from './IApp'

export class App implements IEntity {
  name: string
  private roles: RoleList
  private components: ComponentList
  private features: FeatureList

  constructor(config: IApp) {
    this.name = config.name
    this.roles = new RoleList(config.roles)
    this.components = new ComponentList(config.components)
    this.features = new FeatureList(config.features, {
      roles: this.roles,
      components: this.components,
    })
  }

  validateConfig() {
    const errors: ConfigError[] = []
    errors.push(...this.roles.validateConfig())
    errors.push(...this.components.validateConfig())
    errors.push(...this.features.validateConfig())
    return errors
  }
}
