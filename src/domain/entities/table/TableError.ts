import type { EngineErrorCode } from '../EngineError'

export type TableErrorCode =
  | EngineErrorCode
  | 'NAME_REQUIRED'
  | 'UNKNOWN_PROPERTY'
  | 'NAME_STRING_TYPE_REQUIRED'
  | 'FIELDS_REQUIRED'

export type TableErrorData = {
  property: string
}

export class TableError extends Error {
  public code: string

  constructor(
    public message: TableErrorCode,
    public data?: TableErrorData
  ) {
    super(message)
    this.name = 'TABLE_ERROR'
    this.code = this.name + '_' + message
  }
}
