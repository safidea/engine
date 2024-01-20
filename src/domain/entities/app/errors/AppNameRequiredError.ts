export class AppNameRequiredError extends Error {
  constructor() {
    super('APP_NAME_REQUIRED')
  }
}
