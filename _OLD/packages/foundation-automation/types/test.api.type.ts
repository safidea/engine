import { InOutput } from './inoutput.api.type'
import { TestTable } from './table.test.api.type'

export type Test = {
  name: string
  before: {
    input: InOutput[]
    tables: TestTable[]
  }
  after: {
    output: InOutput[]
    tables: TestTable[]
  }
}
