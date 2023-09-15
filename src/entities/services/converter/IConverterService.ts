export interface IConverterService {
  htmlToPdf(html: string): Promise<Buffer>
}
