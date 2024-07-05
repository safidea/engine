import type { IconName } from '@domain/libraries/Icon'
import type { Spi } from '@domain/services/IconLibrary'

export interface Driver {
  outline: (name: IconName) => React.FC
  solid: (name: IconName) => React.FC
}

export class IconLibrarySpi implements Spi {
  constructor(private driver: Driver) {}

  outline = (name: IconName) => {
    return this.driver.outline(name)
  }

  solid = (name: IconName) => {
    return this.driver.solid(name)
  }
}
