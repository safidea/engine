export class UnknownRolePropertyError extends Error {
  constructor(public property: string) {
    super('UNKNOWN_ROLE_PROPERTY')
  }
}
