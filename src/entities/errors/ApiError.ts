export class ApiError extends Error {
  constructor(
    private readonly _message: string,
    private readonly _status: number = 500
  ) {
    super(_message)
    if (_status === 200) throw new Error('ApiError status cannot be 200')
  }

  get status(): number {
    return this._status
  }

  get message(): string {
    return this._message
  }
}
