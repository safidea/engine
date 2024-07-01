import type { Drivers } from '@adapter/spi'
import type { ReactComponents } from '@domain/engine/page/component'

export interface AppOptions {
  drivers?: Drivers
  components?: ReactComponents
}
