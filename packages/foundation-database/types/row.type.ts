import { Data } from './data.type'

export type Row = Data & {
  id: string
  created_at: string
  updated_at: string
  deleted_at?: string
}
