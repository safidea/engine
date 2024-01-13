import {
  HtmlToPdfConverterDriver,
  IConverterDrivers,
} from '@adapters/mappers/converter/IConverterDrivers'
import { PuppeteerHtmlToPdfConverter } from './HtmlToPdfConverter/PuppeteerHtmlToPdfConverter'

export type ConverterDrivers = {
  htmlToPdf: 'puppeteer'
}
export type ConverterDriversOptions = {
  tmpFolder: string
}

export function getConverterDrivers(
  driversNames: ConverterDrivers = { htmlToPdf: 'puppeteer' },
  { tmpFolder }: ConverterDriversOptions
): IConverterDrivers {
  const { htmlToPdf = 'puppeteer' } = driversNames
  let htmlToPdfConverter: HtmlToPdfConverterDriver

  switch (htmlToPdf) {
    case 'puppeteer':
      htmlToPdfConverter = new PuppeteerHtmlToPdfConverter(tmpFolder)
      break
    default:
      throw new Error(`HtmlToPdf Converter driver '${htmlToPdf}' not found`)
  }

  return {
    htmlToPdfConverter,
  }
}
