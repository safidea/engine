import type { IconName } from '@domain/libraries/Icon'

export interface IIconLibrarySpi {
  outline: (name: IconName) => React.FC
  solid: (name: IconName) => React.FC
}

export class IconLibrary {
  constructor(private _spi: IIconLibrarySpi) {}

  outline = (name: IconName) => {
    return this._spi.outline(name)
  }

  solid = (name: IconName) => {
    return this._spi.solid(name)
  }
}
