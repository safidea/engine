export interface IHtmlToPdfConverter {
  convert(html: string): Promise<Buffer>
}
