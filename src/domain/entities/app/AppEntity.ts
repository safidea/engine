import { ComponentList } from '../component/ComponentList'
import { FeatureList } from '../feature/FeatureList'
import { RoleList } from '../role/RoleList'
import type { IApp } from './IApp'

export class AppEntity {
  roles: RoleList
  feature: FeatureList
  components: ComponentList

  constructor(public config: IApp) {
    this.roles = new RoleList(config.roles)
    this.feature = new FeatureList(config.features)
    this.components = new ComponentList(config.components)
  }
}
