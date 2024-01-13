export interface HtmlToPdfConverterDriver {
  convert(html: string): Promise<Buffer>
}

export interface IConverterDrivers {
  htmlToPdfConverter: HtmlToPdfConverterDriver
}
