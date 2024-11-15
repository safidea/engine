import { BaseEmail, type EmailFields } from './base'

export class SentEmail extends BaseEmail {
  constructor(fields: EmailFields) {
    super(fields)
  }

  findLink = (text: string) => {
    return this.html.match(new RegExp(`href="([^"]+)"[^>]*>${text}`))?.[1]
  }
}
