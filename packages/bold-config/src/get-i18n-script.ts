import type { Config } from '../types/config.type'

export default function getI18nScript(config: Config): string {
  const i18n = {
    defaultLocale: config.defaultLocale,
    locales: config.locales?.map((t) => t.locale) ?? [],
    localeDetection: false,
  }
  if (config.localeRedirect) i18n.localeDetection = config.localeRedirect

  return `const i18n = ${JSON.stringify(i18n, null, 2)}
  
module.exports = { i18n }`
}
