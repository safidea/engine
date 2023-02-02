import { locales } from '../config'
import type { Locale } from 'bold-config'

export default function getNamespaces(locale: string): string[] {
  const namespaces = locales.find((l: Locale) => l.locale === locale)?.namespaces
  if (!namespaces) return []
  return Object.keys(namespaces)
}
