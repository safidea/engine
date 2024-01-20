import { FeatureEntity } from '@domain/entities/feature/FeatureEntity'
import { drivers } from '@drivers/index'
import { FeatureError } from '@domain/entities/feature/FeatureError'
import type { IRole } from './role'
import type { IComponent } from './component'
import { RoleList } from '@domain/entities/role/RoleList'
import { ComponentList } from '@domain/entities/component/ComponentList'

interface IFeatureParams {
  roles: IRole[]
  components: IComponent[]
}

export class Feature {
  errors: FeatureError[] = []
  entity: FeatureEntity | undefined

  constructor(
    public config: unknown,
    params: IFeatureParams
  ) {
    const { jsonValidator } = drivers
    const { json, errors } = jsonValidator.validateFeatureConfig(config)
    if (errors) {
      this.errors = errors
    } else {
      const roles = new RoleList(params.roles)
      const components = new ComponentList(params.components)
      this.entity = new FeatureEntity(json, { roles, components })
      if (this.entity.errors.length) {
        this.errors = this.entity.errors
      }
    }
  }
}

export type { IFeature } from '@domain/entities/feature/IFeature'
export { FeatureError }
