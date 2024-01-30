import type { IDatabaseTableDriver } from './IDatabaseTableDriver'

export interface IDatabaseDriver {
  disconnect: () => Promise<void>
  table: (name: string) => IDatabaseTableDriver
}
