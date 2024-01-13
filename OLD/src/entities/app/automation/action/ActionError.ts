export class ActionError extends Error {
  constructor(
    readonly name: string,
    readonly type: string,
    readonly message: string,
    readonly automation: string
  ) {
    super(`${automation} - ${name} (${type}): ${message}`)
  }
}
