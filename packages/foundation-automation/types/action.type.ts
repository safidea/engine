import type { Environment } from './environment.type'
import type { Value, ValueType } from './value.type'

export type Action = {
  input: {
    [key: string]: Value
  }
  output: {
    [key: string]: Value
  }
  implementation: {
    type: 'javascript'
    resources?: string[]
    environment: Environment
    source: string
  }
  tests: {
    [key: string]: {
      input: {
        [key: string]: ValueType
      }
      output: {
        [key: string]: ValueType
      }
    }
  }
}
