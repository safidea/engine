import { FeatureEntity } from '@domain/entities/feature/FeatureEntity'
import { drivers } from '@drivers/index'
import { FeatureError } from '@domain/entities/feature/FeatureError'
import type { IRole } from './role'
import type { IComponent } from './component'
import { RoleList } from '@domain/entities/role/RoleList'
import { ComponentList } from '@domain/entities/component/ComponentList'
import type { ConfigError } from '@domain/entities/ConfigError'
import { SpecError } from './spec'

export class Feature {
  errors: ConfigError[] = []
  entity: FeatureEntity | undefined

  constructor(
    public config: unknown,
    params: {
      roles: IRole[]
      components: IComponent[]
    }
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

  async testSpecs(): Promise<ConfigError[]> {
    const { name, specs: [spec] = [] } = this.entity?.config || {}
    if ('text' in spec.then[0]) {
      return [
        new SpecError('TEXT_NOT_FOUND', {
          feature: name,
          spec: spec.name,
          text: spec.then[0].text,
        }),
      ]
    }
    return []
  }
}

export type { IFeature } from '@domain/entities/feature/IFeature'
export { FeatureError }
