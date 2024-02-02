import type { EngineErrorCode } from "../EngineError"

export type RoleErrorCode =
  | EngineErrorCode
  | 'NAME_REQUIRED'
  | 'UNKNOWN_PROPERTY'
  | 'NAME_STRING_TYPE_REQUIRED'

export interface RoleErrorData {
  property: string
}

export class RoleError extends Error {
  public code: string

  constructor(
    public message: RoleErrorCode,
    public data?: RoleErrorData
  ) {
    super(message)
    this.name = 'ROLE_ERROR'
    this.code = this.name + '_' + message
  }
}
