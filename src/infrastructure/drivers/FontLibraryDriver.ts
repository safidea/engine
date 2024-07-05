import type { Driver } from '@adapter/spi/FontLibrarySpi'
import type { Name } from '@domain/libraries/Font'

export class FontLibraryDriver implements Driver {
  load = async (name: Name) => {
    return name
  }
}
