import { AppApi } from '@adapter/api/AppApi'
import type { AppOptions } from '@adapter/api/options/App'
import { components } from '@infrastructure/components'
import { drivers } from '@infrastructure/drivers'

export type { AppOptions as Options } from '@adapter/api/options/App'
export type { App as Config } from '@adapter/api/configs/App'
export type { Props, ReactComponents } from '@domain/engine/page/component'
export { ConfigError } from '@domain/entities/error/Config'
export { TestError } from '@domain/entities/error/Test'
export { SchemaError } from '@domain/entities/error/Schema'

export default class extends AppApi {
  constructor(options: AppOptions = {}) {
    super({
      drivers: { ...drivers, ...options?.drivers },
      components: { ...components, ...options?.components?.overwritten },
    })
  }
}
