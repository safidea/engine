import type { Name } from '@domain/libraries/Icon'

export interface Spi {
  outline: (name: Name) => React.FC
  solid: (name: Name) => React.FC
}

export class IconLibrary {
  constructor(private spi: Spi) {}

  outline = (name: Name) => {
    return this.spi.outline(name)
  }

  solid = (name: Name) => {
    return this.spi.solid(name)
  }
}
