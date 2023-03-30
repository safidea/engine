import type { App } from './app.config.type'
import type { Page } from 'foundation-page'
import type { Automation } from 'foundation-automation'
import type { ComponentUI } from 'foundation-component'
import type { Theme, Color, Font, FontOptions } from './theme/theme.type'
import type { Locale, Resources } from './locale/locale.type'

export type Config = App & {
  pages?: Page[]
  apis?: Automation[]
  tables?: Table[]
  theme?: Theme
  locales?: Locale[]
  components?: ComponentUI[]
}

type Field = {
  name: string
  type: string
  primary?: boolean
  unique?: boolean
  required?: boolean
  default?: string
  table?: string
}

type Table = {
  name: string
  fields: Field[]
}

export type {
  App,
  Page,
  Automation,
  Table,
  Theme,
  Locale,
  ComponentUI,
  Color,
  Font,
  FontOptions,
  Resources,
}
