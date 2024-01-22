import { drivers } from '@drivers/index'
import type { ConfigError } from '@domain/entities/ConfigError'
import { App } from '@domain/entities/app/App'

export function createApp(
  config: unknown
): { errors: ConfigError[]; app: undefined } | { app: App; errors: undefined } {
  const { jsonValidator } = drivers
  const { json, errors } = jsonValidator.validateAppConfig(config)
  if (errors) {
    return { errors, app: undefined }
  } else {
    const app = new App(json)
    const errors = app.validateConfig()
    if (errors.length) {
      return { errors, app: undefined }
    }
    return { app, errors: undefined }
  }
}

export type { IApp } from '@domain/entities/app/IApp'
export { AppError } from '@domain/entities/app/AppError'
