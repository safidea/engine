import type { Drivers } from '@adapter/spi'
import type { ReactComponents } from '@domain/engine/page/component'
import type { CustomizedComponents } from '@domain/engine/page/component/Customized'

export interface AppOptions {
  components?: {
    overwritten?: Partial<ReactComponents>
    customized?: CustomizedComponents
  }
  drivers?: Drivers
}
