import { Record } from '@domain/entities/app/Record'

export interface FetcherGatewayAbstract {
  getTableRecordsHook: (table: string) => () => {
    records: Record[]
    error?: string
    isLoading: boolean
  }
  syncTableRecords: () => (records: Record[]) => Promise<{ error?: string }>
}
