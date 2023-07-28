import { Automation } from './automation/Automation'
import { Page } from './page/Page'
import { Table } from './table/Table'

export class App {
  constructor(
    private readonly _name: string = 'My app',
    private readonly _version: string = '0.0.1',
    private readonly _pages: Page[] = [],
    private readonly _tables: Table[] = [],
    private readonly _automations: Automation[] = []
  ) {}

  get name(): string {
    return this._name
  }

  get version(): string {
    return this._version
  }

  get pages(): Page[] {
    return this._pages
  }

  get tables(): Table[] {
    return this._tables
  }

  get automations(): Automation[] {
    return this._automations
  }
}
