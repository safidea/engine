import type { IApp } from '@domain/entities/app/IApp'
import type { AppError } from '@domain/entities/app/AppError'

export interface IJsonValidatorData {
  data: IApp
  errors: undefined
}

export interface IJsonValidatorErrors {
  data: undefined
  errors: AppError[]
}

export interface IJsonValidator {
  validateAppConfig(json: unknown): IJsonValidatorData | IJsonValidatorErrors
}
