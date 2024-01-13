import { IConverterDrivers } from './IConverterDrivers'
import { IConverterMapper } from '@entities/services/converter/IConverterMapper'

export class ConverterMapper implements IConverterMapper {
  constructor(readonly drivers: IConverterDrivers) {}

  async htmlToPdf(html: string) {
    return this.drivers.htmlToPdfConverter.convert(html)
  }
}
