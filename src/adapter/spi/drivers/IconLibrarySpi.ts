import type { Name } from '@domain/libraries/Icon'
import type { Spi } from '@domain/services/IconLibrary'

export interface Driver {
  outline: (name: Name) => React.FC
  solid: (name: Name) => React.FC
}

export class IconLibrarySpi implements Spi {
  constructor(private _driver: Driver) {}

  outline = (name: Name) => {
    return this._driver.outline(name)
  }

  solid = (name: Name) => {
    return this._driver.solid(name)
  }
}
