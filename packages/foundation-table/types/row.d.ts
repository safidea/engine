import { Data } from './data'

export type Row = Data & {
  id: number
  created_at: string
  updated_at: string
  deleted_at?: string
}
