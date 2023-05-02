export interface TestDataInterface {
  [key: string]: string | number | boolean
}

export interface BuiltDataInterface {
  data: TestDataInterface
  fields: {
    [key: string]: {
      type: string
      optional: boolean
      default: string | number | boolean
    }
  }
}
