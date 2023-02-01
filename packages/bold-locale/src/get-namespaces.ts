import { locales } from 'bold-build'
import type { Locale } from '../types/locale.type'

export default function getNamespaces(locale: string): string[] {
  const namespaces = locales.find((l: Locale) => l.locale === locale)?.namespaces
  if (!namespaces) return []
  return Object.keys(namespaces)
}
