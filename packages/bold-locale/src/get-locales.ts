import { locales } from 'bold-build'
import type { Locale } from '../types/locale.type'

export default function getLocales(): string[] {
  return locales.map((t: Locale) => t.locale)
}
