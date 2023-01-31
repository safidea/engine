import { Color } from './color.theme.type'
import { Font } from './font.theme.type'
import { FontOptions } from './options.font.theme.type'
import { ThemePage } from './page.theme.type'

export type Theme = {
  darkMode?: string
  container?: {
    center: boolean
  }
  extend?: {
    colors?: Color[]
  }
  fonts?: Font[]
}

export type { Color, Font, FontOptions, ThemePage }
