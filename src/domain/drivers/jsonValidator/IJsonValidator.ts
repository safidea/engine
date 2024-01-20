import type { IApp } from '@domain/entities/app/IApp'
import type { AppError } from '@domain/entities/app/AppError'

export interface IJsonValidatorData {
  json: IApp
  errors: undefined
}

export interface IJsonValidatorErrors {
  json: undefined
  errors: AppError[]
}

export interface IJsonValidator {
  validateAppConfig(json: unknown): IJsonValidatorData | IJsonValidatorErrors
}
