import { AppDto } from '@application/dtos/AppDto'
import { App } from 'shared-app'

export function mapDtoToApp(app: AppDto): App {
  return {
    name: app.name ?? 'My new app',
    version: app.version ?? '0.0.0',
  }
}
