import type { EngineErrorCode } from '../EngineError'

export type SpecErrorCode =
  | EngineErrorCode
  | 'NAME_REQUIRED'
  | 'UNKNOWN_PROPERTY'
  | 'NAME_STRING_TYPE_REQUIRED'
  | 'WHEN_REQUIRED'
  | 'THEN_REQUIRED'
  | 'TEXT_NOT_FOUND'
  | 'TITLE_NOT_FOUND'
  | 'ATTRIBUTE_NOT_FOUND'
  | 'INPUT_NOT_FOUND'

export type SpecErrorData =
  | {
      property: string
    }
  | {
      feature: string
      spec: string
      expected: string
      received?: string
      tag?: string
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
