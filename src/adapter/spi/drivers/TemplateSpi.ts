import type { ITemplateSpi } from '@domain/services/Template'

export interface ITemplateDriver {
  fill: (data: { [key: string]: unknown }) => string
}

export class TemplateSpi implements ITemplateSpi {
  constructor(private _driver: ITemplateDriver) {}

  fill = (data: { [key: string]: unknown }): string => {
    return this._driver.fill(data)
  }
}
