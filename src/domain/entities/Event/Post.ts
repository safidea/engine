import { TestError } from '@domain/entities/Error/Test'
import { BaseWithRequest, type BaseParams } from './base'

interface Params extends BaseParams {
  path: string
  body: object
}

export class Post extends BaseWithRequest {
  private log: (message: string) => void

  constructor(private params: Params) {
    super()
    const { logger } = params
    this.log = logger.init('event:post')
  }

  executeWithRequest = async (baseUrl: string) => {
    const { path, body } = this.params
    this.log(`posting "${JSON.stringify(body)}" to path "${path}"`)
    const res = await fetch(`${baseUrl}${path}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    })
    if (!res.ok) {
      throw new TestError({
        code: 'POST_REQUEST_ERROR',
        expected: 200,
        received: res.status,
      })
    }
  }
}
