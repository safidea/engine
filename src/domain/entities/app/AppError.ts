export type AppCodeError =
  | { code: 'NAME_REQUIRED' }
  | { code: 'ROLES_REQUIRED' }
  | { code: 'FEATURES_REQUIRED' }
  | { code: 'UNKNOWN_PROPERTY'; propertyToRemove: string }

export class AppError extends Error {
  constructor(public data: AppCodeError) {
    super(data.code)
  }
}
