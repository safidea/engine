import type { Config } from '@adapter/api/configs/Config'
import * as Sentry from './Sentry'

export function instrument(config: Config) {
  if (config.monitors) {
    for (const monitor of config.monitors) {
      if (monitor.driver === 'Sentry') Sentry.init(monitor)
    }
  }
}
