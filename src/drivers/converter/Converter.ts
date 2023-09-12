import { join } from 'path'
import fs from 'fs-extra'
import { PuppeteerHtmlToPdfConverter } from './HtmlToPdfConverter/PuppeteerHtmlToPdfConverter'
import { IConverterSpi } from '@entities/drivers/converter/IConverterSpi'
import { IHtmlToPdfConverter } from './HtmlToPdfConverter/IHtmlToPdfConverter'

export interface ConverterOptions {
  htmlToPdfConverter?: IHtmlToPdfConverter
}

export class Converter implements IConverterSpi {
  private htmlToPdfConverter: IHtmlToPdfConverter

  constructor(folder: string, converterOptions: ConverterOptions = {}) {
    const tmpFolder = join(folder, 'tmp')
    fs.ensureDirSync(tmpFolder)
    const { htmlToPdfConverter } = converterOptions
    this.htmlToPdfConverter = htmlToPdfConverter ?? new PuppeteerHtmlToPdfConverter(tmpFolder)
  }

  async htmlToPdf(html: string) {
    return this.htmlToPdfConverter.convert(html)
  }
}
