import type { IApp } from '@domain/entities/app/IApp'
import type { AppError } from '@domain/entities/app/AppError'
import type { IRole } from '@domain/entities/role/IRole'
import type { RoleError } from 'src/role'

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
}
