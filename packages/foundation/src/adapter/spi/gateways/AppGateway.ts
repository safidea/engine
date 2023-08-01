import { App } from '@domain/entities/App'

export class AppGateway {
  constructor(private readonly _app: App) {}

  getTableFields(tableName: string) {
    const { tables } = this._app
    if (!tables) throw new Error('Tables not found in app')
    const table = tables.find((t) => t.name === tableName)
    if (!table) throw new Error(`Table ${tableName} not found`)
    return table.fields
  }
}
