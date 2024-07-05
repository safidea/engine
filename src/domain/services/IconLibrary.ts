import type { IconName } from '@domain/libraries/Icon'

export interface Spi {
  outline: (name: IconName) => React.FC
  solid: (name: IconName) => React.FC
}

export class IconLibrary {
  constructor(private spi: Spi) {}

  outline(name: IconName) {
    return this.spi.outline(name)
  }

  solid(name: IconName) {
    return this.spi.solid(name)
  }
}
