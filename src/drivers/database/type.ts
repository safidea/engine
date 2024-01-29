import type { IDatabaseRow } from '@domain/drivers/IDatabase'

export interface Database {
  [key: string]: IDatabaseRow
}
