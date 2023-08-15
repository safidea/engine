import { join } from 'path'
import fs from 'fs-extra'
import { PuppeteerHtmlToPdfConverter } from './HtmlToPdfConverter/PuppeteerHtmlToPdfConverter'
import { IConverterAdapter } from '@adapter/spi/converter/IConverterAdapter'
import { IHtmlToPdfConverter } from './HtmlToPdfConverter/IHtmlToPdfConverter'

export interface ConverterOptions {
  htmlToPdfConverter?: IHtmlToPdfConverter
}

export class Converter implements IConverterAdapter {
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
