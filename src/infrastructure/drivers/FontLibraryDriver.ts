import type { Driver } from '@adapter/spi/FontLibrarySpi'

export class FontLibraryDriver implements Driver {
  load = async (name: string) => {
    return name ?? 'name'
  }
}
