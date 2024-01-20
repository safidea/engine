export class AppRolesRequiredError extends Error {
  constructor() {
    super('ROLES_REQUIRED')
  }
}
