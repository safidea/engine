import type { IThemeSpi } from '@domain/services/Theme'

export interface IThemeDriver {
  build: (htmlContents: string[], fontsCss?: string[]) => Promise<string>
}

export class ThemeSpi implements IThemeSpi {
  constructor(private _driver: IThemeDriver) {}

  build = async (htmlContents: string[], fontsCss?: string[]) => {
    return this._driver.build(htmlContents, fontsCss)
  }
}
