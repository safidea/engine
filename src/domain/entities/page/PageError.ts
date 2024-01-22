export type PageErrorCode =
  | 'NAME_REQUIRED'
  | 'UNKNOWN_PROPERTY'
  | 'NAME_STRING_TYPE_REQUIRED'
  | 'PATH_REQUIRED'
  | 'BODY_REQUIRED'
  | 'COMPONENT_NOT_FOUND'

export type PageErrorData =
  | {
      property: string
    }
  | {
      component: string
    }

export class PageError extends Error {
  public code: string

  constructor(
    public message: PageErrorCode,
    public data?: PageErrorData
  ) {
    super(message)
    this.name = 'PAGE_ERROR'
    this.code = this.name + '_' + message
  }
}
