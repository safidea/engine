import { type Drivers } from '@adapter/spi'
import { AppMapper, type Params } from './mappers/AppMapper'
import type { App } from '@domain/entities/app/App'
import type { ReactComponents } from '@domain/entities/page/Component'
import { Api } from './Api'
import type { App as AppConfig } from './configs/App'
import type { EngineError } from '@domain/entities/EngineError'

export class AppApi extends Api<AppConfig, EngineError, App, Params> {
  constructor(drivers: Drivers, components: ReactComponents) {
    super(drivers, components, AppMapper, 'app')
  }
}
