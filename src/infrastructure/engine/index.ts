import { AppApi } from '@adapter/api/AppApi'
import type { Drivers } from '@adapter/spi'
import type { ReactComponents } from '@domain/engine/page/component'
import { components } from '@infrastructure/components'
import { drivers } from '@infrastructure/drivers'

export type { App as Config } from '@adapter/api/configs/App'
export type { Props, ReactComponents } from '@domain/engine/page/component'
export type { Icon } from '@domain/engine/page/component/Icon'
export { ConfigError } from '@domain/entities/error/Config'
export { TestError } from '@domain/entities/error/Test'
export { SchemaError } from '@domain/entities/error/Schema'

export default class extends AppApi {
  constructor(options: { drivers?: Drivers; components?: Partial<ReactComponents> } = {}) {
    super({
      drivers: { ...drivers, ...options?.drivers },
      components: { ...components, ...options?.components },
    })
  }
}
