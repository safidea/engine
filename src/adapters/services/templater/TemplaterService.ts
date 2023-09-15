import { ITemplaterService } from '@entities/services/templater/ITemplaterService'
import { ITemplateDriver } from './ITemplaterDriver'

export class TemplaterService implements ITemplaterService {
  constructor(readonly driver: ITemplateDriver) {}

  render(data: unknown): string {
    return this.driver.render(data)
  }

  compile(template: string): ITemplaterService {
    return this.driver.compile(template)
  }
}
