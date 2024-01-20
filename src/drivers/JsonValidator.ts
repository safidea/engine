import Ajv from 'ajv'
import fs from 'fs-extra'
import { join } from 'path'
import type { JSONSchemaType, ValidateFunction } from 'ajv'
import type { IJsonValidator } from '@domain/drivers/jsonValidator/IJsonValidator'
import type { IApp } from '@domain/entities/app/IApp'
import {
  AppNameRequiredError,
  AppRolesRequiredError,
  AppFeaturesRequiredError,
  UnknownAppPropertyError,
  AppComponentsRequiredError,
  AppTranslationsRequiredError,
} from '@domain/entities/app/AppError'
import type { IRole } from '@domain/entities/role/IRole'
import { RoleNameRequiredError, UnknownRolePropertyError } from '@domain/entities/role/RoleError'

const schemaPath = join(process.cwd(), 'schemas/')

class JsonValidator implements IJsonValidator {
  private validateApp: ValidateFunction<IApp>
  private validateRole: ValidateFunction<IRole>

  constructor() {
    const ajv = new Ajv({ allErrors: true })
    const appSchema: JSONSchemaType<IApp> = fs.readJSONSync(join(schemaPath, 'app.schema.json'))
    const roleSchema: JSONSchemaType<IRole> = fs.readJSONSync(join(schemaPath, 'role.schema.json'))
    this.validateApp = ajv.compile(appSchema)
    this.validateRole = ajv.compile(roleSchema)
  }

  validateAppConfig(json: unknown) {
    if (this.validateApp(json)) {
      return { json }
    } else if (this.validateApp.errors) {
      const errors = this.validateApp.errors.map((error) => {
        const { keyword, params } = error
        if (keyword === 'required') {
          if (params.missingProperty === 'name') return new AppNameRequiredError()
          if (params.missingProperty === 'roles') return new AppRolesRequiredError()
          if (params.missingProperty === 'features') return new AppFeaturesRequiredError()
          if (params.missingProperty === 'components') return new AppComponentsRequiredError()
          if (params.missingProperty === 'translations') return new AppTranslationsRequiredError()
        } else if (keyword === 'additionalProperties') {
          return new UnknownAppPropertyError(params.additionalProperty)
        }
        throw new Error('Unknown AJV error: ' + JSON.stringify(error, null, 2))
      })
      return { errors }
    } else {
      return { errors: [] }
    }
  }

  validateRoleConfig(json: unknown) {
    if (this.validateRole(json)) {
      return { json }
    } else if (this.validateRole.errors) {
      const errors = this.validateRole.errors.map((error) => {
        const { keyword, params } = error
        if (keyword === 'required') {
          if (params.missingProperty === 'name') return new RoleNameRequiredError()
        } else if (keyword === 'additionalProperties') {
          return new UnknownRolePropertyError(params.additionalProperty)
        }
        throw new Error('Unknown AJV error: ' + JSON.stringify(error, null, 2))
      })
      return { errors }
    } else {
      return { errors: [] }
    }
  }
}

export default new JsonValidator()
