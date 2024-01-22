export type ComponentErrorCode =
  | 'NAME_REQUIRED'
  | 'UNKNOWN_PROPERTY'
  | 'NAME_STRING_TYPE_REQUIRED'
  | 'TEMPLATE_REQUIRED'

export interface ComponentErrorData {
  property: string
}

export class ComponentError extends Error {
  public code: string

  constructor(
    public message: ComponentErrorCode,
    public data?: ComponentErrorData
  ) {
    super(message)
    this.name = 'COMPONENT_ERROR'
    this.code = this.name + '_' + message
  }
}
