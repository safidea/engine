import Ajv from 'ajv'
import fs from 'fs-extra'
import { join } from 'path'
import type { JSONSchemaType, ValidateFunction } from 'ajv'
import type { IJsonValidator } from '@domain/drivers/jsonValidator/IJsonValidator'
import type { IApp } from '@domain/entities/app/IApp'
import { AppError } from '@domain/entities/app/AppError'
import type { IRole } from '@domain/entities/role/IRole'
import { RoleError } from '@domain/entities/role/RoleError'

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
        const { instancePath, keyword, params } = error
        if (keyword === 'required') {
          if (params.missingProperty === 'name') return new AppError('NAME_REQUIRED')
          if (params.missingProperty === 'roles') return new AppError('ROLES_REQUIRED')
          if (params.missingProperty === 'features') return new AppError('FEATURES_REQUIRED')
          if (params.missingProperty === 'components') return new AppError('COMPONENTS_REQUIRED')
          if (params.missingProperty === 'translations')
            return new AppError('TRANSLATIONS_REQUIRED')
        } else if (keyword === 'additionalProperties') {
          return new AppError('UNKNOWN_PROPERTY', { property: params.additionalProperty })
        } else if (keyword === 'type') {
          if (instancePath === '/name') return new AppError('NAME_STRING_TYPE_REQUIRED')
          if (instancePath === '/roles') return new AppError('ROLES_ARRAY_TYPE_REQUIRED')
          if (instancePath === '/features') return new AppError('FEATURES_ARRAY_TYPE_REQUIRED')
          if (instancePath === '/components') return new AppError('COMPONENTS_ARRAY_TYPE_REQUIRED')
          if (instancePath === '/translations')
            return new AppError('TRANSLATIONS_ARRAY_TYPE_REQUIRED')
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
          if (params.missingProperty === 'name') return new RoleError('NAME_REQUIRED')
        } else if (keyword === 'additionalProperties') {
          return new RoleError('UNKNOWN_PROPERTY', { property: params.additionalProperty })
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
