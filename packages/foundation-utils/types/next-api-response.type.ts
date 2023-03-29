/* eslint-disable @typescript-eslint/no-explicit-any */
import { ServerResponse } from 'http'

export interface NextApiResponse extends ServerResponse {
  status: (statusCode: number) => NextApiResponse
  json: (data: any) => NextApiResponse
  send: (body: any) => NextApiResponse
}
