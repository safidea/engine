import { Feature } from '@domain/entities/feature/Feature'
import { drivers } from '@drivers/index'
import { FeatureError } from '@domain/entities/feature/FeatureError'
import type { IRole } from './role'
import type { IComponent } from './component'
import { RoleList } from '@domain/entities/role/RoleList'
import { ComponentList } from '@domain/entities/component/ComponentList'
import type { ConfigError } from '@domain/entities/ConfigError'

export function createFeature(
  config: unknown,
  params: {
    roles: IRole[]
    components: IComponent[]
  }
): { errors: ConfigError[]; feature: undefined } | { feature: Feature; errors: undefined } {
  const { jsonValidator } = drivers
  const { json, errors } = jsonValidator.validateFeatureConfig(config)
  if (errors) {
    return { errors, feature: undefined }
  } else {
    const roles = new RoleList(params.roles)
    const components = new ComponentList(params.components)
    const feature = new Feature(json, { roles, components })
    const errors = feature.validateConfig()
    if (errors.length) {
      return { errors, feature: undefined }
    }
    return { feature, errors: undefined }
  }
}

export type { IFeature } from '@domain/entities/feature/IFeature'
export { FeatureError }
