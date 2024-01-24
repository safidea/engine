export type SpecErrorCode =
  | 'UNKNOWN_SCHEMA_ERROR'
  | 'NAME_REQUIRED'
  | 'UNKNOWN_PROPERTY'
  | 'NAME_STRING_TYPE_REQUIRED'
  | 'WHEN_REQUIRED'
  | 'THEN_REQUIRED'
  | 'TEXT_NOT_FOUND'

export type SpecErrorData =
  | {
      property: string
    }
  | {
      feature: string
      spec: string
      text: string
    }

export class SpecError extends Error {
  public code: string

  constructor(
    public message: SpecErrorCode,
    public data?: SpecErrorData
  ) {
    super(message)
    this.name = 'SPEC_ERROR'
    this.code = this.name + '_' + message
  }
}
