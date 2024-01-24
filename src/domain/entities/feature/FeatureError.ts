export type FeatureErrorCode =
  | 'UNKNOWN_SCHEMA_ERROR'
  | 'NAME_REQUIRED'
  | 'UNKNOWN_PROPERTY'
  | 'NAME_STRING_TYPE_REQUIRED'
  | 'ROLE_NOT_FOUND'

export type FeatureErrorData =
  | {
      property: string
    }
  | {
      feature: string
      role: string
    }

export class FeatureError extends Error {
  public code: string

  constructor(
    public message: FeatureErrorCode,
    public data?: FeatureErrorData
  ) {
    super(message)
    this.name = 'FEATURE_ERROR'
    this.code = this.name + '_' + message
  }
}
