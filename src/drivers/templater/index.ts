import { HandlebarsTemplater } from './HandlebarsTemplater'

export type TemplaterDrivers = 'handlebars'

export function getTemplaterDriver(templater: TemplaterDrivers = 'handlebars') {
  switch (templater) {
    case 'handlebars':
      return new HandlebarsTemplater()
    default:
      throw new Error(`Templater driver '${templater}' not found`)
  }
}
