export interface HtmlToPdfConverterDriver {
  convert(html: string, tmpFolder: string): Promise<Buffer>
}

export interface ConverterDrivers {
  htmlToPdfConverter: HtmlToPdfConverterDriver
}
