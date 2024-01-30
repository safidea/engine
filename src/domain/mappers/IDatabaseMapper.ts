import type { IDatabaseTableMapper } from './IDatabaseTableMapper'

export interface IDatabaseMapper {
  table: (name: string) => IDatabaseTableMapper
}
