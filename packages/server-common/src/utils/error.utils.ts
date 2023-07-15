type ApiErrorInterface = {
  status: number
  errors?: string[]
}

export class ApiError extends Error {
  public data: ApiErrorInterface
  constructor(message: string, data: ApiErrorInterface) {
    super(message)
    if (data.status === 200) throw new Error('ApiError status cannot be 200')
    this.data = data
  }
}
