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
    return mapDtoToApp(this.config as AppDto, this.ui)
  }
}
