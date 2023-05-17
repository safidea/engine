export type TestDataType = {
  [key: string]: string | number | boolean
}

export type BuildDataOptionsType = {
  initData?: TestDataType
  isValid?: boolean
}

export type BuiltDataType = {
  data: TestDataType
  fields: {
    [key: string]: {
      type: string
      optional: boolean
      default: string | number | boolean
    }
  }
}