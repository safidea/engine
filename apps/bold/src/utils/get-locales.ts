import { locales } from '../config'
import type { Locale } from 'foundation-config'

export default function getLocales(): string[] {
  return locales.map((t: Locale) => t.locale)
}
