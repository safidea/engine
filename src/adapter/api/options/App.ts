import type { Drivers } from '@adapter/spi'
import type { ReactComponents } from '@domain/engine/page/component'

export interface AppOptions {
  components?: {
    overwritten?: Partial<ReactComponents>
    customized?: { [key: string]: React.FC }
  }
  drivers?: Drivers
}
