import type { App as Config } from '@adapter/api/configs/App'
import * as Sentry from './Sentry'

export function instrument(config: Config) {
  if (config.monitors) {
    for (const monitor of config.monitors) {
      if (monitor.driver === 'Sentry') Sentry.init(monitor)
    }
  }
}
