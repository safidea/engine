import { App } from '@domain/entities/App'
import { AppGateway } from '@adapter/spi/gateways/AppGateway'
import { mapDtoToApp } from '@application/mappers/AppMapper'
import { IUIGateway } from '@domain/gateways/IUIGateway'

export class ConfigureApp {
  constructor(
    private AppGateway: AppGateway,
    private ui: IUIGateway
  ) {}

  execute(): App {
    const appDto = this.AppGateway.appDto
    return mapDtoToApp(appDto, this.ui)
  }
}
