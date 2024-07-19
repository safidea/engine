import { AppApi } from '@adapter/api/AppApi'
import { components } from '@infrastructure/components'
import { drivers } from '@infrastructure/drivers'
import type { Drivers as AllDrivers } from '@adapter/spi/Drivers'
import type { ReactComponents as AllReactComponents } from '@domain/entities/Component'

export type { App } from '@adapter/api/configs/App'
export type ReactComponents = Partial<AllReactComponents>
export type Drivers = Partial<AllDrivers>

export default class extends AppApi {
  constructor(
    options: {
      drivers?: Drivers
      components?: ReactComponents
    } = {}
  ) {
    super({
      drivers: { ...drivers, ...options?.drivers },
      components: { ...components, ...options?.components },
    })
  }
}
