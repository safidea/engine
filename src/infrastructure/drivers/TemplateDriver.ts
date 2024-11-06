import type { Driver } from '@adapter/spi/drivers/TemplateSpi'

export class TemplateDriver implements Driver {
  constructor(private _template: HandlebarsTemplateDelegate) {}

  fill = (data: { [key: string]: unknown }) => {
    return this._template(data)
  }
}
