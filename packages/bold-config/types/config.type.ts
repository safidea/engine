import type { App } from './app.config.type'
import type { Page } from 'bold-page'
import type { Api } from 'bold-api'
import type { Table } from 'bold-table'
import type { ComponentUI } from 'bold-component'
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
