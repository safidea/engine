export class UnknownAppPropertyError extends Error {
  constructor(public property: string) {
    super('UNKNOWN_APP_PROPERTY')
  }
}
