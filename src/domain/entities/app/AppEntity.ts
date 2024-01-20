import { ComponentList } from '../component/ComponentList'
import { FeatureList } from '../feature/FeatureList'
import { RoleList } from '../role/RoleList'
import type { IApp } from './IApp'

export class AppEntity {
  roles: RoleList
  components: ComponentList
  feature: FeatureList


  constructor(public config: IApp) {
    this.roles = new RoleList(config.roles)
    this.components = new ComponentList(config.components)
    this.feature = new FeatureList(config.features, {
      roles: this.roles,
      components: this.components
    })
  }
}
