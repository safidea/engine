export class AppUnknownPropertyError extends Error {
  constructor(public property: string) {
    super('UNKNOWN_PROPERTY')
  }
}
