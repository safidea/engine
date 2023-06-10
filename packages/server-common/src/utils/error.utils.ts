type ApiErrorInterface = {
  status: number
  errors?: string[]
}

export class ApiError extends Error {
  public data: ApiErrorInterface
  constructor(message: string, data: ApiErrorInterface) {
    super(message)
    this.data = data
  }
}
