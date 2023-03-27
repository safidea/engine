import { Data } from './data'

export type Db = {
  create: (params: { data: Data }) => Promise<Data>
  update: (params: { data: Data; where: Data }) => Promise<Data>
}
