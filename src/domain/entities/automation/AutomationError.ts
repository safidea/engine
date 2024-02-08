import type { EngineErrorCode } from '../EngineError'

export type AutomationErrorCode =
  | EngineErrorCode
  | 'NAME_REQUIRED'
  | 'UNKNOWN_PROPERTY'
  | 'NAME_STRING_TYPE_REQUIRED'
  | 'FIELDS_REQUIRED'

export interface AutomationErrorData {
  property: string
}

export class AutomationError extends Error {
  public code: string

  constructor(
    public message: AutomationErrorCode,
    public data?: AutomationErrorData
  ) {
    super(message)
    this.name = 'AUTOMATION_ERROR'
    this.code = this.name + '_' + message
  }
}
