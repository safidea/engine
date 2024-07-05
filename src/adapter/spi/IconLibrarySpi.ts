import type { Name } from '@domain/libraries/Icon'
import type { Spi } from '@domain/services/IconLibrary'

export interface Driver {
  outline: (name: Name) => React.FC
  solid: (name: Name) => React.FC
}

export class IconLibrarySpi implements Spi {
  constructor(private driver: Driver) {}

  outline = (name: Name) => {
    return this.driver.outline(name)
  }

  solid = (name: Name) => {
    return this.driver.solid(name)
  }
}
