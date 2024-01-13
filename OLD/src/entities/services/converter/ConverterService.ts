import { IConverterMapper } from '@entities/services/converter/IConverterMapper'

export class ConverterService {
  constructor(readonly mapper: IConverterMapper) {}

  async htmlToPdf(html: string) {
    return this.mapper.htmlToPdf(html)
  }
}
