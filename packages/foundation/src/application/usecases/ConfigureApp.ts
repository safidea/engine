import { App } from '@domain/entities/App'
import { mapDtoToApp } from '@application/mappers/AppMapper'
import { IUIGateway } from '@domain/gateways/IUIGateway'
import { ajv } from '@application/utils/SchemaValidator'
import { AppDtoSchema } from '@application/dtos/AppDto'

const validate = ajv.compile(AppDtoSchema)

export class ConfigureApp {
  constructor(
    private config: unknown,
    private ui: IUIGateway
  ) {}

  execute(): App {
    if (validate(this.config)) return mapDtoToApp(this.config, this.ui)
    if (validate.errors) throw new Error(JSON.stringify(validate.errors[0], null, 2))
    throw new Error('should throw a validation error')
  }
}
