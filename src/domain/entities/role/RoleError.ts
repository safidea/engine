export type RoleErrorCode = 'NAME_REQUIRED' | 'UNKNOWN_PROPERTY'

export interface RoleErrorData {
  property: string
}

export class RoleError extends Error {
  public code: string

  constructor(
    message: RoleErrorCode,
    public data?: RoleErrorData
  ) {
    super(message)
    this.name = 'ROLE_ERROR'
    this.code = this.name + '_' + message
  }
}
