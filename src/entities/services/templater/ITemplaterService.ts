export interface ITemplaterService {
  render(data: unknown): string
  compile(template: string): ITemplaterService
}
