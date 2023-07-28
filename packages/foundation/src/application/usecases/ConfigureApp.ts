import { App } from '@domain/entities/App'
import { AppGateway } from '@adapter/spi/gateways/AppGateway'
import { mapDtoToApp } from '@application/mappers/AppMapper'
import { IUIGateway } from '@domain/gateways/IUIGateway'
import { AppDto } from '@application/dtos/AppDto'

export class ConfigureApp {
  constructor(
    private config: unknown,
    private ui: IUIGateway
  ) {}

  execute(): App {
    // TODO: install AJV and validate config from AppDto schema
    if (typeof this.config === 'object' && this.config && 'unknown' in this.config)
      throw new Error('Config validation fail : "unknown" property is not allowed')
    return mapDtoToApp(this.config as AppDto, this.ui)
  }
}
