import type { App } from './app.config.type'
import type { Page } from 'foundation-page'
import type { Api } from 'foundation-api'
import type { Table } from 'foundation-table'
import type { ComponentUI } from 'foundation-component'
import type { Theme, Color, Font, FontOptions } from './theme/theme.type'
import type { Locale, Resources } from './locale/locale.type'

export type Config = App & {
  pages?: Page[]
  apis?: Api[]
  tables?: Table[]
  theme?: Theme
  locales?: Locale[]
  components?: ComponentUI[]
}

export type {
  App,
  Page,
  Api,
  Table,
  Theme,
  Locale,
  ComponentUI,
  Color,
  Font,
  FontOptions,
  Resources,
}
