import type { Base } from './base'

export interface SendEmail extends Base {
  action: 'SendEmail'
  to: string
  subject: string
  body: string
}
