export interface IConverterMapper {
  htmlToPdf(html: string): Promise<Buffer>
}
