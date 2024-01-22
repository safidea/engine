import Ajv from 'ajv'
import fs from 'fs-extra'
import { join } from 'path'
import type { JSONSchemaType, ValidateFunction } from 'ajv'
import type { IJsonValidator } from '@domain/drivers/IJsonValidator'
import type { IApp } from '@domain/entities/app/IApp'
import { AppError } from '@domain/entities/app/AppError'
import type { IRole } from '@domain/entities/role/IRole'
import { RoleError } from '@domain/entities/role/RoleError'
import type { IFeature } from '@domain/entities/feature/IFeature'
import type { IComponent } from '@domain/entities/component/IComponent'
import type { IPage } from '@domain/entities/page/IPage'
import type { ISpec } from '@domain/entities/spec/ISpec'
import { SpecError } from '@domain/entities/spec/SpecError'
import { ComponentError } from '@domain/entities/component/ComponentError'
import { FeatureError } from '@domain/entities/feature/FeatureError'
import { PageError } from '@domain/entities/page/PageError'

const schemaPath = join(process.cwd(), 'schemas/')

class JsonValidator implements IJsonValidator {
  private validateApp: ValidateFunction<IApp>
  private validateRole: ValidateFunction<IRole>
  private validateFeature: ValidateFunction<IFeature>
  private validateComponent: ValidateFunction<IComponent>
  private validatePage: ValidateFunction<IPage>
  private validateSpec: ValidateFunction<ISpec>

  constructor() {
    const ajv = new Ajv({ allErrors: true })
    const appSchema: JSONSchemaType<IApp> = fs.readJSONSync(join(schemaPath, 'app.schema.json'))
    const roleSchema: JSONSchemaType<IRole> = fs.readJSONSync(join(schemaPath, 'role.schema.json'))
    const featureSchema: JSONSchemaType<IFeature> = fs.readJSONSync(
      join(schemaPath, 'feature.schema.json')
    )
    const componentSchema: JSONSchemaType<IComponent> = fs.readJSONSync(
      join(schemaPath, 'component.schema.json')
    )
    const pageSchema: JSONSchemaType<IPage> = fs.readJSONSync(join(schemaPath, 'page.schema.json'))
    const specSchema: JSONSchemaType<ISpec> = fs.readJSONSync(join(schemaPath, 'spec.schema.json'))
    this.validateApp = ajv.compile(appSchema)
    this.validateRole = ajv.compile(roleSchema)
    this.validateFeature = ajv.compile(featureSchema)
    this.validateComponent = ajv.compile(componentSchema)
    this.validatePage = ajv.compile(pageSchema)
    this.validateSpec = ajv.compile(specSchema)
  }

  validateAppConfig(json: unknown) {
    if (this.validateApp(json)) {
      return { json }
    } else if (!this.validateApp.errors) {
      throw new Error('No AJV errors found while app is invalid')
    }
    const errors = this.validateApp.errors.map((error) => {
      const { instancePath, keyword, params } = error
      if (keyword === 'required') {
        if (params.missingProperty === 'name') return new AppError('NAME_REQUIRED')
        if (params.missingProperty === 'roles') return new AppError('ROLES_REQUIRED')
        if (params.missingProperty === 'features') return new AppError('FEATURES_REQUIRED')
        if (params.missingProperty === 'components') return new AppError('COMPONENTS_REQUIRED')
        if (params.missingProperty === 'translations') return new AppError('TRANSLATIONS_REQUIRED')
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
  }

  validateRoleConfig(json: unknown) {
    if (this.validateRole(json)) {
      return { json }
    } else if (!this.validateRole.errors) {
      throw new Error('No AJV errors found while role is invalid')
    }
    const errors = this.validateRole.errors.map((error) => {
      const { keyword, params, instancePath } = error
      if (keyword === 'required') {
        if (params.missingProperty === 'name') return new RoleError('NAME_REQUIRED')
      } else if (keyword === 'additionalProperties') {
        return new RoleError('UNKNOWN_PROPERTY', { property: params.additionalProperty })
      } else if (keyword === 'type') {
        if (instancePath === '/name') return new RoleError('NAME_STRING_TYPE_REQUIRED')
      }
      throw new Error('Unknown AJV error: ' + JSON.stringify(error, null, 2))
    })
    return { errors }
  }

  validateComponentConfig(json: unknown) {
    if (this.validateComponent(json)) {
      return { json }
    } else if (!this.validateComponent.errors) {
      throw new Error('No AJV errors found while component is invalid')
    }
    const errors = this.validateComponent.errors.map((error) => {
      const { keyword, params, instancePath } = error
      if (keyword === 'required') {
        if (params.missingProperty === 'name') return new ComponentError('NAME_REQUIRED')
        if (params.missingProperty === 'props') return new ComponentError('PROPS_REQUIRED')
        if (params.missingProperty === 'template') return new ComponentError('TEMPLATE_REQUIRED')
      } else if (keyword === 'additionalProperties') {
        return new ComponentError('UNKNOWN_PROPERTY', { property: params.additionalProperty })
      } else if (keyword === 'type') {
        if (instancePath === '/name') return new ComponentError('NAME_STRING_TYPE_REQUIRED')
      }
      throw new Error('Unknown AJV error: ' + JSON.stringify(error, null, 2))
    })
    return { errors }
  }

  validateFeatureConfig(json: unknown) {
    if (this.validateFeature(json)) {
      return { json }
    } else if (!this.validateFeature.errors) {
      throw new Error('No AJV errors found while feature is invalid')
    }
    const errors = this.validateFeature.errors.map((error) => {
      const { keyword, params, instancePath } = error
      if (keyword === 'required') {
        if (params.missingProperty === 'name') return new FeatureError('NAME_REQUIRED')
        if (params.missingProperty === 'story') return new FeatureError('STORY_REQUIRED')
        if (params.missingProperty === 'specs') return new FeatureError('SPECS_REQUIRED')
        if (params.missingProperty === 'pages') return new FeatureError('PAGES_REQUIRED')
      } else if (keyword === 'additionalProperties') {
        return new FeatureError('UNKNOWN_PROPERTY', { property: params.additionalProperty })
      } else if (keyword === 'type') {
        if (instancePath === '/name') return new FeatureError('NAME_STRING_TYPE_REQUIRED')
      }
      throw new Error('Unknown AJV error: ' + JSON.stringify(error, null, 2))
    })
    return { errors }
  }

  validateSpecConfig(json: unknown) {
    if (this.validateSpec(json)) {
      return { json }
    } else if (!this.validateSpec.errors) {
      throw new Error('No AJV errors found while spec is invalid')
    }
    const errors = this.validateSpec.errors.map((error) => {
      const { keyword, params, instancePath } = error
      if (keyword === 'required') {
        if (params.missingProperty === 'name') return new SpecError('NAME_REQUIRED')
        if (params.missingProperty === 'when') return new SpecError('WHEN_REQUIRED')
        if (params.missingProperty === 'then') return new SpecError('THEN_REQUIRED')
      } else if (keyword === 'additionalProperties') {
        return new SpecError('UNKNOWN_PROPERTY', { property: params.additionalProperty })
      } else if (keyword === 'type') {
        if (instancePath === '/name') return new SpecError('NAME_STRING_TYPE_REQUIRED')
      }
      throw new Error('Unknown AJV error: ' + JSON.stringify(error, null, 2))
    })
    return { errors }
  }

  validatePageConfig(json: unknown) {
    if (this.validatePage(json)) {
      return { json }
    } else if (!this.validatePage.errors) {
      throw new Error('No AJV errors found while page is invalid')
    }
    const errors = this.validatePage.errors.map((error) => {
      const { keyword, params, instancePath } = error
      if (keyword === 'required') {
        if (params.missingProperty === 'name') return new PageError('NAME_REQUIRED')
        if (params.missingProperty === 'path') return new PageError('PATH_REQUIRED')
        if (params.missingProperty === 'seo') return new PageError('SEO_REQUIRED')
        if (params.missingProperty === 'body') return new PageError('BODY_REQUIRED')
      } else if (keyword === 'additionalProperties') {
        return new PageError('UNKNOWN_PROPERTY', { property: params.additionalProperty })
      } else if (keyword === 'type') {
        if (instancePath === '/name') return new PageError('NAME_STRING_TYPE_REQUIRED')
      }
      throw new Error('Unknown AJV error: ' + JSON.stringify(error, null, 2))
    })
    return { errors }
  }
}

export default new JsonValidator()
