import type { ConfigError } from '../ConfigError'
import { ComponentList } from '../component/ComponentList'
import { FeatureList } from '../feature/FeatureList'
import { RoleList } from '../role/RoleList'
import type { IApp } from './IApp'

export class AppEntity {
  roles: RoleList
  components: ComponentList
  features: FeatureList
  errors: ConfigError[] = []

  constructor(public config: IApp) {
    this.roles = new RoleList(config.roles)
    this.components = new ComponentList(config.components)
    this.features = new FeatureList(config.features, {
      roles: this.roles,
      components: this.components,
    })
    this.errors = this.features.validateConfig()
  }
}
