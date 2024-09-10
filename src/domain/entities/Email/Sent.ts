import { Base, type EmailFields } from './base'

export class SentEmail extends Base {
  constructor(fields: EmailFields) {
    super(fields)
  }

  findLink = (text: string) => {
    return this.html.match(new RegExp(`href="([^"]+)"[^>]*>${text}`))?.[1]
  }
}
