export type {
  Config,
  App,
  Page,
  Api,
  Table,
  Theme,
  Locale,
  ComponentUI,
  Resources,
} from './types/config.type'

export { default as checkSchema } from './src/check-schema'
export { default as loadYaml } from './src/load-yaml'

export { configMock } from './__mocks__/config.mock'
