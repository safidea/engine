import type { FilterConfig } from '@domain/entities/Filter'
import type { RecordExpectConfig } from '@domain/entities/Expect/Record'

export interface IRecordExpect extends RecordExpectConfig {
  expect: 'Record'
  find: FilterConfig
}
