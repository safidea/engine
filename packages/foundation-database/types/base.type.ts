import { Data } from './data.type'
import { Row } from './row.type'

export type Base = {
  create: (params: { data: Data }) => Promise<Row>
  update: (params: { data: Row; where: Data }) => Promise<Row>
  upsert: (params: { create: Data; update: Data; where: Data }) => Promise<Row>
  findUnique: (params: { where: Data }) => Promise<Row>
  findMany: (params: { where?: Data }) => Promise<Row[]>
  delete: (params: { where: Data }) => Promise<Row>
}
