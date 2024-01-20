import Ajv from 'ajv'
import fs from 'fs-extra'
import { join } from 'path'
import type { JSONSchemaType, ValidateFunction } from 'ajv'
import type { IJsonValidator } from '@domain/drivers/jsonValidator/IJsonValidator'
import type { IApp } from '@domain/entities/app/IApp'
import { AppError } from '@domain/entities/app/AppError'

const schemaPath = join(process.cwd(), 'schemas/')

class JsonValidator implements IJsonValidator {
  private validateApp: ValidateFunction<IApp>

  constructor() {
    const ajv = new Ajv()
    const appSchema: JSONSchemaType<IApp> = fs.readJSONSync(join(schemaPath, 'app.schema.json'))
    this.validateApp = ajv.compile(appSchema)
  }

  validateAppConfig(json: unknown) {
    if (this.validateApp(json)) {
      return { data: json }
    } else if (this.validateApp.errors) {
      const errors = this.validateApp.errors.map(() => {
        return new AppError('NAME_REQUIRED')
      })
      return { errors }
    } else {
      return { errors: [] }
    }
  }
}

export default new JsonValidator()
