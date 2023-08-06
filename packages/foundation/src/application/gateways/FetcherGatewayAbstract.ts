import { Record } from '@domain/entities/app/Record'

export interface FetcherGatewayAbstract {
  getTableRecordsHook: (table: string) => () => {
    records: Record[]
    error?: string
    isLoading: boolean
  }
  createTableRecord: (table: string) => (record: Record) => Promise<{ id?: string; error?: string }>
  getEnrichedTableRecord: (
    table: string,
    recordId: string
  ) => Promise<{ record?: Record; error?: string }>
}
