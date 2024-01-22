import type { IApp } from '@domain/entities/app/IApp'
import type { AppError } from '@domain/entities/app/AppError'
import type { IRole } from '@domain/entities/role/IRole'
import type { IPage } from '@domain/entities/page/IPage'
import type { RoleError } from '@domain/entities/role/RoleError'
import type { PageError } from '@domain/entities/page/PageError'
import type { ISpec } from '@domain/entities/spec/ISpec'
import type { IFeature } from '@domain/entities/feature/IFeature'
import type { IComponent } from '@domain/entities/component/IComponent'
import type { FeatureError } from '@domain/entities/feature/FeatureError'
import type { ComponentError } from '@domain/entities/component/ComponentError'
import type { SpecError } from '@domain/entities/spec/SpecError'

export interface IJsonValidatorData<T> {
  json: T
  errors: undefined
}

export interface IJsonValidatorErrors<T> {
  json: undefined
  errors: T[]
}

export interface IJsonValidator {
  validateAppConfig(json: unknown): IJsonValidatorData<IApp> | IJsonValidatorErrors<AppError>
  validateRoleConfig(json: unknown): IJsonValidatorData<IRole> | IJsonValidatorErrors<RoleError>
  validatePageConfig(json: unknown): IJsonValidatorData<IPage> | IJsonValidatorErrors<PageError>
  validateSpecConfig(json: unknown): IJsonValidatorData<ISpec> | IJsonValidatorErrors<SpecError>
  validateFeatureConfig(
    json: unknown
  ): IJsonValidatorData<IFeature> | IJsonValidatorErrors<FeatureError>
  validateComponentConfig(
    json: unknown
  ): IJsonValidatorData<IComponent> | IJsonValidatorErrors<ComponentError>
}
