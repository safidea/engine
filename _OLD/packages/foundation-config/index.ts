export type {
  Config,
  App,
  Page,
  Automation,
  Table,
  Theme,
  Locale,
  ComponentUI,
  Resources,
} from './types/config.type'

export { default as checkSchema } from './src/check-schema'
export { default as loadYaml } from './src/load-yaml'
export { default as buildLocales } from './src/build-locales'
export { default as buildConfig } from './src/build-config'

export { configMock } from './__mocks__/config.mock'
