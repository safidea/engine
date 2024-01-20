export type SpecErrorCode =
  | 'NAME_REQUIRED'
  | 'UNKNOWN_PROPERTY'
  | 'NAME_STRING_TYPE_REQUIRED'
  | 'WHEN_REQUIRED'
  | 'THEN_REQUIRED'

export interface SpecErrorData {
  property: string
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
