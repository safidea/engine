export interface ITemplatingSpi {
  render(data: unknown): string
  compile(template: string): ITemplatingSpi
}
