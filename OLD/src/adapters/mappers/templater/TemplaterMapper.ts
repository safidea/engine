import { ITemplaterMapper } from '@entities/services/templater/ITemplaterMapper'
import { ITemplateDriver } from './ITemplaterDriver'

export class TemplaterMapper implements ITemplaterMapper {
  constructor(readonly driver: ITemplateDriver) {}

  render(data: unknown): string {
    return this.driver.render(data)
  }

  compile(template: string): ITemplaterMapper {
    return this.driver.compile(template)
  }
}
