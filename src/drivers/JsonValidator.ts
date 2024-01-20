import Ajv from 'ajv'
import fs from 'fs-extra'
import { join } from 'path'
import type { JSONSchemaType, ValidateFunction } from 'ajv'
import type { IJsonValidator } from '@domain/drivers/jsonValidator/IJsonValidator'
import type { IApp } from '@domain/entities/app/IApp'
import { AppNameRequiredError } from '@domain/entities/app/errors/AppNameRequiredError'
import { AppRolesRequiredError } from '@domain/entities/app/errors/AppRolesRequiredError'
import { AppFeaturesRequiredError } from '@domain/entities/app/errors/AppFeaturesRequiredError'
import { AppUnknownPropertyError } from '@domain/entities/app/errors/AppUnknownPropertyError'
import { AppComponentsRequiredError } from '@domain/entities/app/errors/AppComponentsRequiredError'
import { AppTranslationsRequiredError } from '@domain/entities/app/errors/AppTranslationsRequiredError'

const schemaPath = join(process.cwd(), 'schemas/')

class JsonValidator implements IJsonValidator {
  private validateApp: ValidateFunction<IApp>

  constructor() {
    const ajv = new Ajv({ allErrors: true })
    const appSchema: JSONSchemaType<IApp> = fs.readJSONSync(join(schemaPath, 'app.schema.json'))
    this.validateApp = ajv.compile(appSchema)
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
          return new AppUnknownPropertyError(params.additionalProperty)
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
