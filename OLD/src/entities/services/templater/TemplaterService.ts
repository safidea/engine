import { ITemplaterMapper } from './ITemplaterMapper'

export class TemplaterService {
  constructor(readonly mapper: ITemplaterMapper) {}

  render(data: unknown): string {
    return this.mapper.render(data)
  }

  compile(template: string): ITemplaterMapper {
    return this.mapper.compile(template)
  }
}
