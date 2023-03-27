import { Data, Row } from './data'

export type Db = {
  create: (params: { data: Data }) => Promise<Row>
  update: (params: { data: Row; where: Data }) => Promise<Row>
  findUnique: (params: { where: Data }) => Promise<Row>
  findMany: (params: { where?: Data }) => Promise<Row[]>
  delete: (params: { where: Data }) => Promise<Row>
}
