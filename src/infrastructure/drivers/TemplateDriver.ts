import type { Driver } from '@adapter/spi/TemplateSpi'

export class TemplateDriver implements Driver {
  constructor(private template: HandlebarsTemplateDelegate) {}

  fill = (data: { [key: string]: unknown }) => {
    return this.template(data)
  }
}
