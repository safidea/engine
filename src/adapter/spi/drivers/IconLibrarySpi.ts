import type { IconName } from '@domain/libraries/Icon'
import type { IIconLibrarySpi } from '@domain/services/IconLibrary'

export interface IIconLibraryDriver {
  outline: (name: IconName) => React.FC
  solid: (name: IconName) => React.FC
}

export class IconLibrarySpi implements IIconLibrarySpi {
  constructor(private _driver: IIconLibraryDriver) {}

  outline = (name: IconName) => {
    return this._driver.outline(name)
  }

  solid = (name: IconName) => {
    return this._driver.solid(name)
  }
}
