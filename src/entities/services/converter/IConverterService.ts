export interface IConverterService {
  htmlToPdf(html: string, tmpFolder: string): Promise<Buffer>
}
