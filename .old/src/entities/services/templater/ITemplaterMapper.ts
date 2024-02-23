export interface ITemplaterMapper {
  render(data: unknown): string
  compile(template: string): ITemplaterMapper
}
