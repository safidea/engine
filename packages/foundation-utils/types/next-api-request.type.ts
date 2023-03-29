/* eslint-disable @typescript-eslint/no-explicit-any */
import { IncomingMessage } from 'http'

export interface NextApiRequest extends IncomingMessage {
  method: string
  cookies: { [key: string]: string }
  query: { [key: string]: string }
  body: any
  isPreview?: boolean
}
