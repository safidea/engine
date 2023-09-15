export interface HtmlToPdfConverterDriver {
  convert(html: string, tmpFolder: string): Promise<Buffer>
}

export interface IConverterDrivers {
  htmlToPdfConverter: HtmlToPdfConverterDriver
}
