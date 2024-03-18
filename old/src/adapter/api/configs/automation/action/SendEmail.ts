import type { Base } from './base'

export interface SendEmail extends Base {
  action: 'SendEmail'
  from: string
  to: string
  subject: string
  text: string
  html: string
}
