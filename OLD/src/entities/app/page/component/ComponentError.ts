export class ComponentError extends Error {
  constructor(
    readonly type: string,
    readonly message: string
  ) {
    super(`${type} - ${message}`)
  }
}
