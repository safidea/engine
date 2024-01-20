export class AppNameRequiredError extends Error {
  constructor() {
    super('NAME_REQUIRED')
  }
}
