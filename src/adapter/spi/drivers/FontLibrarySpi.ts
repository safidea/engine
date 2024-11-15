import type { IFontLibrarySpi } from '@domain/services/FontLibrary'

export interface IFontLibraryDriver {
  loadCss: (name: string) => Promise<string>
}

export class FontLibrarySpi implements IFontLibrarySpi {
  constructor(private _driver: IFontLibraryDriver) {}

  loadCss = async (name: string) => {
    return this._driver.loadCss(name)
  }
}
