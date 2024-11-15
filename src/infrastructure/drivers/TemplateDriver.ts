import type { ITemplateDriver } from '@adapter/spi/drivers/TemplateSpi'

export class TemplateDriver implements ITemplateDriver {
  constructor(private _template: HandlebarsTemplateDelegate) {}

  fill = (data: { [key: string]: unknown }) => {
    return this._template(data)
  }
}
