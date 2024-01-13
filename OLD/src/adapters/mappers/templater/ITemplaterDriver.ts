export interface ITemplateDriver {
  render: (data: unknown) => string
  compile: (template: string) => ITemplateDriver
}
