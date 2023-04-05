import { Value, ValueType } from './value.type'

export type Actions = {
  [key: string]: {
    input: {
      [key: string]: Value
    }
    output: {
      [key: string]: Value
    }
    implementation: {
      type: 'javascript'
      resources?: string[]
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
}

export type Config = {
  actions: Actions
}
