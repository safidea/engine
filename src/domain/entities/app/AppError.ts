export type AppCodeError = 'NAME_REQUIRED' | 'ROLES_REQUIRED' | 'FEATURES_REQUIRED'

export class AppError extends Error {
  constructor(code: AppCodeError) {
    super(code)
  }
}
