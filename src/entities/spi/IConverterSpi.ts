export interface IConverterSpi {
  htmlToPdf(html: string): Promise<Buffer>
}
