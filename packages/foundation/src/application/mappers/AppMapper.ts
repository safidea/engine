import { AppDto } from '@application/dtos/AppDto'
import { App } from '@domain/entities/App'

export function mapDtoToApp(schema: AppDto): App {
  return {
    name: schema.name ?? 'My new app',
    version: schema.version ?? '0.0.0',
    pages: schema.pages ?? [],
    tables: schema.tables ?? [],
  }
}

export function mapAppToDto(app: App): AppDto {
  return {
    name: app.name,
    version: app.version,
    pages: app.pages,
    tables: app.tables,
  }
}
