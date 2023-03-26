import { Data } from './data'

export type Base = {
  create: (params: { data: Data }) => Promise<Data>
}
