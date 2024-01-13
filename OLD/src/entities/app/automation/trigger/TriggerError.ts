export class TriggerError extends Error {
  constructor(
    readonly event: string,
    readonly message: string,
    readonly automation: string
  ) {
    super(`${automation} - ${event}: ${message}`)
  }
}
